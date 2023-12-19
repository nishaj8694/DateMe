from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from dating import consumers

websocket_urlpatterns =[
    path("ws/chat/<str:room_name>/",consumers.ChatConsumer.as_asgi(),),
    path("ws/right/",consumers.RigthConsumer.as_asgi(),),
     
    ]
