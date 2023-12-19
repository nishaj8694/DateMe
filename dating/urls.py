from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    # path('test/', views.testEndPoint, name='test'),
    path('create_profile',views.create_profile,name='create_profile'),
    # path('', views.getRoutes),
    path('',views.home,name='home'),
    path('home',views.apiHome,),
    path('home/Match',views.apiMatch),
    path('home/Profile',views.apiProfile),
    path('home/Friends',views.apiFriends),
    path('NewPassword',views.newPAs),



    path('edit_profile',views.edit_profile,name='edit_profile'),

    path('forgot',views.forgot,name='forgot'),
    path('password',views.Password,name='password'),
    path('SendParsel/',views.SendParsel,name='SendParsel'),
    path('verifyotp',views.verifyotp,name='verifyotp'),
    path('upload_image/', views.upload_image, name='upload_image'),
    path('get_data/',views.get_data,name='get_data'),
    path('get_PersonalData/',views.get_PersonalData,name='get_PersonalData'),
    path('get_PersonalImageData/',views.get_PersonalImageData, name='get_PersonalImageData'),
    path('deleteimage/<int:id>',views.deleteimage ,name='deleteimage'),
    path('get_PersonalDeteileData/',views.get_PersonalDeteileData,name='get_PersonalDeteileData'),
    path('get_friendsdata/',views.get_friendsdata,name='get_friendsdata'),
    path('couple_Send_request/',views.couple_Send_request,name='couple_Send_request'),
    path('couple_Accept_request/',views.couple_Accept_request,name='couple_Accept_request'),
    path('couple_Reject_request/',views.couple_Reject_request,name='couple_Reject_request'),
    path('send_chatMsg/',views.send_chatMsg,name='send_chatMsg'),
    path('get_chat/',views.get_chat,name='get_chat'),
    path('get_chatNotifications/',views.get_chatNotifications,name='get_chatNotification'),
    path('imageManage/',views.imageManage.as_view(),name='imageManage'),
    path('imageManage/<int:id>/', views.imageManage.as_view(),name='imageManage'),
    path('profileManage/', views.profileManage.as_view(),name='profileManage'),



    

]