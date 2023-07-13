<template>
  <div class="container">
    <div class="messaging">
      <div class="inbox_msg">
        <div class="mesgs">
          <div class="msg_history">
            <div v-for="message in messages" class="incoming_msg">
              <div
                :class="[
                  message.author === authUser.displayName
                    ? 'sent_msg'
                    : 'received_msg',
                ]"
              >
                <div class="received_withd_msg">
                  <p>{{ message.message }}</p>
                  <span class="time_date">
                    {{ message.craetedAt }} | {{ message.author }}</span
                  >
                  <div class="audio">
                    <audio id="audioController" controls></audio
                    ><img src="../photos/download.png" id="download" />
                    <span> {{ message.craetedAt }} | {{ message.author }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="type_msg">
            <div class="input_msg_write">
              <input
                @keyup.enter="saveMessage"
                v-model="message"
                type="text"
                class="write_msg"
                placeholder="Type a message"
              />
              <i
                class="msg_btn fa fa-microphone"
                id="record"
                @click="startRecording()"
              ></i>
              <button
                class="stop"
                id="stopButton"
                @click="stopRecording()"
              ></button>
              <div class="audio" id="audio" controls>
                <source src="" type="video/webm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';
let recorder;
var audioURL;
var items = [];
export default {
  name: 'chat',

  data() {
    return {
      message: null,
      messages: [],
      authUser: {},
    };
  },

  methods: {
    startRecording() {
      document.getElementById('stopButton').style = 'visibility:visible';
      var device = navigator.mediaDevices.getUserMedia({ audio: true });
      device.then(stream => {
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => {
          items.push(event.data);
          if (recorder.state == 'inactive') {
            let audioBlob = new Blob(items, { type: 'audio/webm' });
            document.getElementById('audio').innerHTML =
              '<source src"' +
              URL.createObjectURL(audioBlob) +
              '"type="video/webm"/>';
            URL.createObjectURL(audioBlob);
            audioURL = document.getElementById('audio').src =
              URL.createObjectURL(audioBlob);
            console.log('Kaydedildi');
            const downloadLink = document.createElement('a');
            downloadLink.href = audioURL;
            downloadLink.download = 'recording.wav';
            downloadLink.innerHTML = '↓';
            document.body.appendChild(downloadLink);
          }
        };
        recorder.start();
        console.log('kayıt başladı');
        setTimeout(() => {
          recorder.stop();
          console.log('kayıt durdu');
        }, 50000);
      });
    },
    stopRecording() {
      recorder.stop();
    },

    scrollToBottom() {
      try {
        let box = document.querySelector('.msg_history');
        box.scrollTop = box.scrollHeight;
      } catch (error) {
        //console.log(error);
      }
    },

    saveMessage() {
      //save to firestore
      db.collection('chat')
        .add({
          message: this.message,
          author: this.authUser.displayName,
          craetedAt: new Date().toLocaleString(),
        })
        .then(() => {
          this.scrollToBottom();
        });
      this.message = null;
    },

    fetchMessages() {
      db.collection('chat')
        .orderBy('craetedAt')
        .onSnapshot(querySnapshot => {
          var allMessages = [];
          querySnapshot.forEach(doc => {
            allMessages.push(doc.data());
          });
          this.messages = allMessages;

          setTimeout(() => {
            this.scrollToBottom();
          }, 500);
        });
    },
  },

  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authUser = user;
      } else {
        this.authUser = {};
      }
    });

    this.fetchMessages();
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          next();
        } else {
          vm.$router.push('/login');
        }
      });
    });
  },
};
</script>

<style scoped="">
.container {
  max-width: 1170px;
  margin: auto;
}

.inbox_msg {
  border: 1px solid #c4c4c4;
  clear: both;
  overflow: hidden;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.received_withd_msg {
  width: 57%;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}

.mesgs {
  padding: 10px 0px 0px 10px;
  width: 100%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_btn {
  font-size: 48px;
  cursor: pointer;
  position: absolute;
  right: 50px;
  top: 3px;
  width: 5%;
}
.stop {
  width: 25px;
  height: 25px;
  border: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 11px;
  background-color: red;
  visibility: hidden;
}
.audio {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
  float: right;
  visibility: hidden;
}
img {
  cursor: pointer;
  float: right;
  right: 0%;
  visibility: hidden;
}
.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>
