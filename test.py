from pydub import AudioSegment
import random

origAudio = AudioSegment.from_wav("Full2.wav")
for i in range(180):
	t1 = i * 1000 #Works in milliseconds
	t2 = (i+1+random.random()) * 1000
	newAudio = origAudio[t1:t2]
	newAudio.export('gen_samples/'+str(i)+'.wav', format="wav")