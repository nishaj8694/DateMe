from django.shortcuts import render
from django.http import JsonResponse
from dating.models import User,Profile,ProfileImage,Couple,chatMessage
from dating.serializer import UserProfileSerializer,ProfileEditSerializer,CoupleSerilizer,MyTokenObtainPairSerializer, RegisterSerializer,ProfileSerializer,ProfileimageSerializer,ChatSerilizer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import AccessToken
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
import random
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder
import json
from django.db.models import Q,Subquery



def home(request):
    return render(request,'index.html')

def newPAs(request):
    return render(request,'index.html')
def apiHome(request):
    return render(request,'index.html')
def apiMatch(request):
    return render(request,'index.html')
def apiProfile(request):
    return render(request,'index.html')
def apiFriends(request):
    return render(request,'index.html')

@api_view(['GET'])
def get_chatNotifications(request):
        id=request.GET.get('user')
        couples = Couple.objects.filter(Q(sender_id=id) | Q(receiver_id=id),status='accepted')
        accepted_couple = set()
        for data in couples:
            if data.sender_id==int(id):
                accepted_couple.add(data.receiver_id)
            if data.receiver_id==int(id):
                accepted_couple.add(data.sender_id)
        chat_messages = chatMessage.objects.filter(couple__in=couples).exclude(user_id=id).order_by('-time')
        chat_notification = Profile.objects.filter(user__in=accepted_couple).prefetch_related('profile_images')
        notification = {profile.user_id: profile for profile in chat_notification}
        check_ids=[]
        serialized_data=[]     
        for chat_Pk in chat_messages:
            user_id = chat_Pk.user_id
            if user_id in notification and user_id not in check_ids:
                person = Profile.objects.filter(user_id=user_id).values().first()
                check_ids.append(user_id)
                send_data={
                        'id':person['user_id'],
                        'name':person['full_name'], 
                        'image':ProfileImage.objects.filter(user__user_id=user_id).values('image').first()['image'],
                        'group':chat_Pk.couple_id,
                        }
                serialized_data.append(send_data)

        return JsonResponse(serialized_data,status=status.HTTP_200_OK, safe=False)

  
    
@api_view(['GET'])
def get_chat(request):
        try:
            id=request.GET.get('user')
            r_id=request.GET.get('recevier')
            msgUser= chatMessage.objects.filter(couple__sender_id=id,couple__receiver_id=r_id)
            if not msgUser :
                msgUser= chatMessage.objects.filter(couple__sender_id=r_id,couple__receiver_id=id)
            try:    
                serialized_data = ChatSerilizer(msgUser, many=True).data
            except:
                return Response(status=status.HTTP_204_NO_CONTENT)
            
            if not msgUser:
                    try:
                        usr = Couple.objects.get(sender_id=id,receiver_id=r_id)
                    except:
                        usr = Couple.objects.get(sender_id=r_id,receiver_id=id)
                    data=[{'couple':usr.id}]
                    return JsonResponse(data, safe=False)
            return JsonResponse(serialized_data, safe=False)
        except:
            return JsonResponse({"error": "Error getting message "},status=status.HTTP_204_NO_CONTENT, safe=False)


@api_view(['POST'])
def send_chatMsg(request):
    if request.method == 'POST':
        try:
            s_id = request.data.get('sender_id')
            r_id = request.data.get('reciever_id')
            chat_text = request.data.get('chat_text')
            print('chat ',chat_text)
            user=User.objects.get(id=s_id)
            try:
                usr = Couple.objects.get(sender_id=s_id,receiver_id=r_id)
            except:
                usr = Couple.objects.get(sender_id=r_id,receiver_id=s_id)
            msgUser= chatMessage.objects.create(couple=usr,content=chat_text,user=user)
            msgUser.save()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response({"error": "something in middle of object"}, status=status.HTTP_400_BAD_REQUEST)
    return Response({"error": "Not get request"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def couple_Accept_request(request):
    if request.method == 'POST':
        send = request.data.get('sender')
        # rec=request.data.get('reciever'),
        receiv = request.data.get('reciever')
        sn=User.objects.get(id=send)
        # print(send,receiv)
        if send == receiv:
            return Response({"error": "Sender and receiver cannot be the same."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            couple = Couple.objects.get(sender_id=send,receiver_id=receiv)
        except:
            couple = Couple.objects.get(sender_id=receiv,receiver_id=send)

            # return Response({"error": "Couple not found."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            couple.status = 'accepted'
            couple.save()
            serializer = CoupleSerilizer(instance=couple)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def couple_Reject_request(request):
    if request.method == 'POST':
        send = request.data.get('sender')
        # rec=request.data.get('reciever'),
        receiv = request.data.get('reciever')
        sn=User.objects.get(id=send)
        if send == receiv:
            return Response({"error": "Sender and receiver cannot be the same."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            couple = Couple.objects.get(sender_id=receiv,receiver_id=send)
        except:
            return Response({"error": "Couple not found."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            couple.status = 'rejected'
            couple.save()
            serializer = CoupleSerilizer(instance=couple)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def couple_Send_request(request):
    if request.method == 'POST': 
       sen=request.data.get('sender'),
       rec=request.data.get('reciever'),
       if sen==rec:
           return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
       try:
          send_data=Couple.objects.get(sender_id=sen,receiver_id=rec)
          if send_data:
           return Response( status=status.HTTP_204_NO_CONTENT)
       except:
          try:
            send_data=Couple.objects.get(sender_id=rec,receiver_id=sen)
            if send_data:
                return Response( status=status.HTTP_204_NO_CONTENT)
          except:
              pass  
              
       data={
            "sender": request.data.get('sender'),
            "receiver":request.data.get('reciever'),
       }    
       serializer = CoupleSerilizer(data=data)
       if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_data(request):
        print(type(request.user.id),request.user.id)
        # id=request.GET.get('user')
        id=request.user.id
        print(type(id),id)
        status_option=['accepted','rejected']
        couples = Couple.objects.filter(status__in=status_option).values_list('sender_id', 'receiver_id')
        accepted_couple=set()
        for sender_id, receiver_id in couples:
            if sender_id==int(id):
                accepted_couple.add(receiver_id)
            if receiver_id==int(id):
                accepted_couple.add(sender_id)
        users = Profile.objects.exclude(user_id=id).prefetch_related('profile_images').exclude(user_id__in=accepted_couple)
        curent_id=id
        serialized_data = imageSerialize(users,curent_id)
        return JsonResponse(serialized_data, safe=False)

@api_view(['GET'])
def get_friendsdata(request):
        id=request.GET.get('user')
        couples = Couple.objects.filter(status='accepted').values_list('sender_id', 'receiver_id')
        # print(couples)
        accepted_couple = set()
        for sender_id, receiver_id in couples:
            if sender_id==int(id):
                accepted_couple.add(receiver_id)
            if receiver_id==int(id):
                accepted_couple.add(sender_id)
        users = Profile.objects.exclude(user_id=id).prefetch_related('profile_images').filter(user_id__in=accepted_couple)
        curent_id=id
        serialized_data = imageSerialize(users,curent_id)
        return JsonResponse(serialized_data, safe=False)


class imageManage(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self,request):
        usr = ProfileImage.objects.filter(user_id=request.user.id)
        serializer = ProfileimageSerializer(usr, many=True)
        return JsonResponse(serializer.data, safe=False)         
    def post(self,request):
        profile = Profile.objects.get(user_id=request.user.id)
        uploaded_images = []
        imageCheck=False

        for img in request.FILES:
            imageCheck=False
            file = request.FILES[img]
            print('file',file)
            data = {
                "user": profile.id,
                "image": file,
            }
            print('data',data)
            serializer = ProfileimageSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                uploaded_images.append(serializer.data)
                imageCheck=True
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        if imageCheck == True:
            return Response(uploaded_images, status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
    
    def delete(self,request,id):
        try:
            profile_id=ProfileImage.objects.get(id=id)
            profile_id.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_304_NOT_MODIFIED)
        


class profileManage(APIView):
    permission_classes = [IsAuthenticated] 
    def get(self,request):
        try:
            usr = Profile.objects.filter(user_id=request.user.id)
            serializer = ProfileSerializer(usr, many=True)
            return JsonResponse(serializer.data, safe=False)
        except:
            return Response('something went wrong', status=status.HTTP_400_BAD_REQUEST)

    def post(self,request):
        id=request.data.get('id')
        try:
            profile=Profile.objects.get(user_id=id)

            data = {
                "full_name": request.data.get('full_name'),
                "height": request.data.get('height'),
                "weight": request.data.get('weight'),
                "birth": request.data.get('birth'),
                "gender": request.data.get('gender'),
                "user": request.data.get('id'),
                
                }

            serializer = ProfileSerializer(instance=profile, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response('something went wrong', status=status.HTTP_400_BAD_REQUEST)

    
    def put(self,request):
        print('work')
        profile=Profile.objects.get(id=request.user.id)
        data = {
            "full_name": request.data.get('Fullname'),
            "height": request.data.get('Height'),
            "weight": request.data.get('Weight'),
            "birth": request.data.get('birth'),
            "gender": request.data.get('Gender'),
            }
        
        print('work')
        serializer = ProfileEditSerializer(instance=profile, data=data)
        print('work')
        
        if serializer.is_valid():
            print('work')
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])  
@permission_classes([IsAuthenticated])
def get_PersonalImageData(request):
        usr = ProfileImage.objects.filter(user_id=request.user.id)
        serializer = ProfileimageSerializer(usr, many=True)
        return JsonResponse(serializer.data, safe=False)


@api_view(['POST'])
def upload_image(request):
   if request.method == 'POST':
    print('upload')
    print(request.data)
    print('upload')
    id = request.data.get('id')
    profile = Profile.objects.get(user_id=id)
    uploaded_images = []
    print(request.FILES)
    for img in request.FILES:
        imageCheck=False
        file = request.FILES[img]
        data = {
            "user": profile.id,
            "image": file,
        }
        serializer = ProfileimageSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            uploaded_images.append(serializer.data)
            imageCheck=True
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if imageCheck == True:
        return Response(uploaded_images, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteimage(request,id):
     if request.method == 'DELETE':
        try:
            # id=request.data.get('id')
            print(id)
            print(' img del worked')
            # profile_id=ProfileImage.objects.get(id=id)
            # profile_id.delete()
            return Response(status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_304_NOT_MODIFIED)




@api_view(['GET'])  
def get_PersonalData(request):
        id=request.GET.get('user')
        users = Profile.objects.filter(user_id=id).prefetch_related('profile_images')
        serializer=UserProfileSerializer(users,many=True)
        return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])  
def get_PersonalDeteileData(request):
        id=request.GET.get('user')
        usr = Profile.objects.filter(user_id=id)
        serializer = ProfileSerializer(usr, many=True)
        return JsonResponse(serializer.data, safe=False)

def imageSerialize(data,curent_id):
    serialized_data=[]
    # print(data) 
    for i in data: 
        received_requests = i.user.sent_request.all()
        sent_requests = i.user.received_request.all()
        
        is_couple=False
        is_send=False
        for request in received_requests:
            if int(request.receiver.id) == int(curent_id):
                is_couple=True

        for response in sent_requests:
            # print('$$$$')
            # print(response.sender.id)
            # print(response.receiver.id)
            # print(curent_id)
            if int(response.sender.id) == int(curent_id):
                is_send=True
         
        serialized_inform = {
            'id': i.id,
            'full_name': i.full_name,
            'images': [{'Photo': j.image.url} for j in i.profile_images.all()],
            'couple': is_couple,
            'sended': is_send
        }
        serialized_data.append(serialized_inform)
    return serialized_data        


   
    # if request.method == 'POST':
    #     id = request.POST['id']
    #     if 'image' in request.FILES:
    #         uploaded_image = request.FILES['image']
    #         profile=Profile.objects.get(user_id=id) 
    #         data = {
    #             "image": uploaded_image,
    #             "user": profile.id,
    #             }
    #         serializer=ProfileimageSerializer(data=data)
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data, status=status.HTTP_201_CREATED)
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     return Response({'error': 'No images is send'}, status=400)    
    # else:
    #     return Response({'error': 'Invalid request'}, status=400)


      


@api_view(['POST'])
def create_profile(request):
    if request.method == 'POST':
        id=request.data.get('id')
        profile=Profile.objects.get(user_id=id)

        data = {
            "full_name": request.data.get('full_name'),
            "height": request.data.get('height'),
            "weight": request.data.get('weight'),
            "birth": request.data.get('birth'),
            "gender": request.data.get('gender'),
            "user": request.data.get('id'),
            
            }
        serializer = ProfileSerializer(instance=profile, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
def edit_profile(request):
    if request.method == 'POST':
        id=request.data.get('id')
        profile=Profile.objects.get(id=id)
        data = {
            "full_name": request.data.get('Fullname'),
            "height": request.data.get('Height'),
            "weight": request.data.get('Weight'),
            "birth": request.data.get('birth'),
            "gender": request.data.get('Gender'),
            }
        serializer = ProfileEditSerializer(instance=profile, data=data)
        if serializer.is_valid():            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def forgot(request):
     user = request.data.get('user')
     custemer= User.objects.get(email=user)
     if custemer:
            try:
                subject = 'Reset your mail'
                message = f"Hi {custemer.username} , click the url for new Password http://127.0.0.1:8000/api/NewPassword?id={custemer.id}"
                sender = settings.EMAIL_HOST_USER
                recipient_email = custemer.email
                send_mail(subject, message, sender, [recipient_email])
                return Response({'response': 'mail sent successfully'}, status=status.HTTP_200_OK)
            except:
                return Response({'responce':'emaile error'}, status.HTTP_400_BAD_REQUEST)
                 
     else:
            return Response({'responce':'incorrect email address'}, status.HTTP_400_BAD_REQUEST)



@api_view(['PATCH'])
def Password(request):
    Password = request.data.get('password')
    Password1 = request.data.get('password2')
    user_id = request.data.get('id')
    try:
      user= User.objects.get(id=user_id)
      if user:
        Password = request.data.get('password')
        Password1 = request.data.get('password2')
         
        if Password != Password1:
                return Response({'responce':'emaile error'}, status.HTTP_400_BAD_REQUEST)
             
        try:
            user.set_password(Password)
            user.save()
            return Response({'response': 'Password changed successfully'}, status=status.HTTP_200_OK)
                    
        except:
            return Response({'response': 'User Password error'}, status=status.HTTP_404_NOT_FOUND) 
     
    except User.DoesNotExist:
        return Response({'response': 'User not found'}, status=status.HTTP_404_NOT_FOUND) 
     

@api_view(['POST'])
def verifyotp(request):
        user_otp=request.data.get('verifyOTP')
        user_email=request.data.get('email')
        user=User.objects.get(email=user_email)
        otp = user.otp.strip()
        user_otp = user_otp.strip()

        if otp == user_otp:
            user.verified=True
            user.save()
            return Response({'response': 'Password changed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'response': 'User not found'}, status=status.HTTP_404_NOT_FOUND) 


@api_view(['POST'])
def SendParsel(request):
        random_number = random.randint(1000, 9999)
        user_email = request.data.get('user')
        user = get_object_or_404(User, email=user_email)
        user.otp = str(random_number)
        user.save()
        subject = 'Hello, Verify Email!'
        message = f'This is a test no {random_number} email sent from Django'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [user.email]
        send_mail(subject, message, from_email, recipient_list)
        return Response({'response': ' user return'}, status=status.HTTP_200_OK) 
        
        # return Response({'response': 'multiple or none user return'}, status=status.HTTP_400_BAD_REQUEST) 
         

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer






