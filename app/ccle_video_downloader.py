#!/usr/bin/python -u
# From https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging

import json
import sys
import struct
import youtube_dl
import os
import re
import configparser

# Read a message from stdin and decode it.
def get_message():
    raw_length = sys.stdin.buffer.read(4)

    if not raw_length:
        sys.exit(0)
    message_length = struct.unpack('=I', raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode("utf-8")
    return json.loads(message)


# Encode a message for transmission, given its content.
def encode_message(message_content):
    encoded_content = json.dumps(message_content).encode("utf-8")
    encoded_length = struct.pack('=I', len(encoded_content))
    #  use struct.pack("10s", bytes), to pack a string of the length of 10 characters
    return {'length': encoded_length, 'content': struct.pack(str(len(encoded_content))+"s",encoded_content)}


# Send an encoded message to stdout.
def send_message(encoded_message):
    sys.stdout.buffer.write(encoded_message['length'])
    sys.stdout.buffer.write(encoded_message['content'])
    sys.stdout.buffer.flush()


# Take in a filename as a string and remove characters that cannot be used in
#  Windows file names
# Directory separators / and \ will be removed as well
def sanitize_filename_for_windows(filename):
    return re.sub(r'[\\/:*?"<>|]', "_", filename)


config = configparser.ConfigParser()
config.read("config")

DL_PATH = os.path.normpath(config.get("download", "path"))
video_info = get_message()

# We will create a separate directory for each class, which we will then save
#  the video to
save_path = os.path.join(DL_PATH, video_info["className"])
os.makedirs(save_path, exist_ok=True)

title = sanitize_filename_for_windows(video_info["title"])
output_filename = str(os.path.join(save_path, title + ".%(ext)s"))

ydl_opts = {
    "outtmpl": output_filename,
    "quiet": True
}

with youtube_dl.YoutubeDL(ydl_opts) as ydl:
    ydl.download([video_info["url"]])

send_message(encode_message("downloading completed"))