from dating.models import User,Profile,ProfileImage,Couple,chatMessage
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.mail import send_mail
from django.conf import settings
import random

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class ProfileEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        exclude = ['id','user']       


class ProfileimageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = '__all__'        


class UserProfileSerializer(serializers.ModelSerializer):
    user=ProfileimageSerializer(source='profile_images', many=True)
    class Meta:
        model = Profile
        fields = ['full_name', 'height', 'weight', 'birth', 'gender','user']


class CoupleSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Couple
        fields = '__all__'        
        
class ChatSerilizer(serializers.ModelSerializer):
    class Meta:
        model = chatMessage
        fields = '__all__'

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.profile.full_name
        token['username'] = user.username
        token['email'] = user.email
        token['verified'] = user.verified
        
        print(token)
        return token
   
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']

        )

        user.set_password(validated_data['password'])
        user.save()

        return user

class PasswordSerializer(serializers.ModelSerializer):
        password = serializers.CharField(
            write_only=True, required=True, validators=[validate_password])
        password2 = serializers.CharField(write_only=True, required=True)

        class Meta:
            model = User
            fields = ('id','password', 'password2')

        def validate(self, attrs):
            if attrs['password'] != attrs['password2']:
                raise serializers.ValidationError(
                    {"password": "Password fields didn't match."})

            return attrs

        def update(self, validated_data):
            user = User.objects.get(
                id=validated_data['user']

            )

            user.set_password(validated_data['password'])
            user.save()

            return user
