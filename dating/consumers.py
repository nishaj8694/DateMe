import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.http import HttpRequest
from asgiref.sync import sync_to_async
from dating.models import User,Profile,ProfileImage,Couple,chatMessage
import datetime

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['content']
        reciev = text_data_json['user']
        roomName = text_data_json['room']

        print('current id = ',reciev)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'content': message,
                'user':reciev
            }
        )

        await sync_to_async(chatMessage.objects.create)(couple_id=roomName, content=message, user_id=reciev)

    async def chat_message(self, event):
        message = event['content']
        reciev = event['user']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'content': message,
            'user':reciev
        }))


class RigthConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'right'
        await self.channel_layer.group_add(
            self.room_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['content']
        reciev = text_data_json['user']
        roomName = text_data_json['room']
        timestamp = text_data_json['timestamp']
        
        print('current id = ',reciev)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'content': message,
                'user':reciev,
                'timestamp':timestamp
            }
        )


    async def chat_message(self, event):
        message = event['content']
        reciev = event['user']
        timestamp =  event['timestamp']

        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'content': message,
            'user':reciev,
            'timestamp':timestamp

        }))        
