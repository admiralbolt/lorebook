import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

# Groups are used for sets of clients on the same socket. If we had something
# like a chat room, we would have multiple clients talking to the same socket.
# In this case we only need a single group because there will be a master ->
# slave relationship between the control panel and the client.
GROUP = "one_group_to_rule_them_all"

class ControlConsumer(WebsocketConsumer):

  def connect(self):
    # Establishes the group name when connecting, again it's hardcoded.
    async_to_sync(self.channel_layer.group_add)(GROUP, self.channel_name)
    self.accept()

  def disconnect(self, close_code):
    async_to_sync(self.channel_layer.group_discard)(GROUP, self.channel_name)

  def receive(self, text_data):
    # Receieve gets called when a message is sent to the socket. We can choose
    # to modify the data before sending to the client, but in this case we just
    # use it as a passthrough.
    async_to_sync(self.channel_layer.group_send)(GROUP, {
      "type": "transmit",
      "data": json.loads(text_data)
    })

  def transmit(self, event):
    # Send message to socket.
    self.send(text_data=json.dumps(event["data"]))
