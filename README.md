# RPS-Multiplayer
Multiplayer remote rock-paper-scisors.


There were a number of goals I had with this project that I wasn't able to reach, partially because of technical problems I had, mainly with Bootstrap. The other impediment was time and my understanding of Firebase, which took a while for me to familiarize myself with the syntax/common commands and workflows.

Nevertheless, it works. If you have two windows open, you can play RPS and it will render correct results. If you close one of the windows, it closes out the data in Firebase, but every piece of information sent to Firebase includes an identifier based on username, which is stored locally, so the user that does not connect won't notice that much of an interruption.

You can also chat, one line at a time, in the chat box. I would like to develop a more persistent chat system, where the system prints out
all of the chats from that session every time a new chat is added, so that you have a fairly seamless chat history, like we're all used to
at this point in 2018. If I have the time to work on anything before class, it'll be that.

It is somewhat mobile-friendly, though not awesome, on a phone. That's another detail I would like to work more on, maybe change the way the title is displayed because the jumbotron kind of screws up mobile viewing. Again, Bootstrap and its double edged sword.

I've included validation tags in the Bootstrap, and I've included, in several places, if loops that check for certain conditions before allowing the player to take certain actions that are either not in the correct playflow or would break the code.

This was a really daunting exercise, but I'm quite glad I took on the challenge. I'm proud of what I've made, rough as it is.
