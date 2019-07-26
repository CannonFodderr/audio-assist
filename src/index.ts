class AudioAssist {
    private AC: any
    private ss: SpeechSynthesis
    ac?: AudioContext
    mGainNode?: GainNode
    mOscNode?: OscillatorNode
    constructor(AC: any, SS: any){
        this.AC = AC
        this.ss = SS
    }
    async init (){
        this.ac = await new this.AC()
        if(this.ac){
            this.mGainNode = this.ac.createGain()
            this.mGainNode.gain.setValueAtTime(0.5, this.ac.currentTime)
            this.mGainNode.connect(this.ac.destination)
        }
        await this.addListeners()
    }
    addListeners(){
        var elem: NodeList = document.body.querySelectorAll('*')
        elem.forEach(element => {
            element.addEventListener('mouseenter', (e: any) => {
                audioAssist.speak(e.target.textContent)
            })
            element.addEventListener('keyup', (e: any) => {
                switch(e.which){
                    case 9: if(e.target.textContent) {
                        audioAssist.speak(e.target.textContent)
                    }
                }
            })
        })
    }
    playTone(stopAfter: number = 2000){
        if(!this.ac || !this.mGainNode) return
        if(this.mOscNode){
            this.mOscNode.stop()
        }
        this.mOscNode = this.ac.createOscillator()
        this.mOscNode.connect(this.mGainNode)
        this.mOscNode.start()
        if(stopAfter){
            setTimeout(() => { 
                if(this.mOscNode){
                    this.mOscNode.stop()
                }
            }, stopAfter)
        }
    }
    test(): void{
        if(!this.ac || !this.mGainNode) {
            this.init()
            .then(() => this.playTone(1000))
            .catch(err => console.error(err))
            return
        } 
        this.playTone(1000)
    }
    testSpeech(): void{
        const greeting = "Hi, Speech synthesizer is working correctly"
        this.speak(greeting, 4)
    }
    speak(text: string, voice?: number): void{
        if(this.ss.speaking){
            this.ss.cancel()
        }
        const sentences = text.split(/[\.\!\?\...]/g)
        sentences.forEach(sentence => {
            const utter = new SpeechSynthesisUtterance(sentence)
            if(voice){
                const voices = this.ss.getVoices()
                utter.voice = voices[voice]
            }
            this.ss.speak(utter)
        })
    }
}

const audioAssist = new AudioAssist(this.AudioContext, this.speechSynthesis)