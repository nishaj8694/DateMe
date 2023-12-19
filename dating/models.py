from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
import datetime

class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=100)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


    def profile(self):
        profile = Profile.objects.get(user=self)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    height = models.CharField(max_length=100)
    weight = models.CharField(max_length=100)
    birth = models.DateField(null=True,blank=True,default=None)
    gender = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username

    def img(self):
        imag = ProfileImage.objects.get(user=self)
        return imag

class ProfileImage(models.Model):
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='profile_images')
    image = models.ImageField(upload_to='profile_images/') 
    
    def __str__(self):
        return f"Image for {self.user.username}"    
    
    # Mother_tougue= models.CharField(max_length=100)
    # smoke=models.BooleanField()
    # drink=models.BooleanField()
    # drugs=models.BooleanField()
    # relationship_status=models.CharField(max_length=100)
    # relegions=models.CharField()
    # caste=models.CharField()
    # hobby=models.ForeignKey()
    # location = models.CharField(max_length=None)


    



def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)


class Couple(models.Model):
    sender = models.ForeignKey(User, related_name='sent_request', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_request', on_delete=models.CASCADE)
    status = models.CharField(choices=[('pending', 'Pending'),('accepted', 'Accepted'), 
                             ('rejected', 'Rejected')], default='pending', max_length=20)
    

class chatMessage(models.Model):
    couple = models.ForeignKey(Couple,related_name='chat_meassage',on_delete=models.CASCADE)
    content=models.TextField()
    time=models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, related_name='current_user', on_delete=models.CASCADE)    