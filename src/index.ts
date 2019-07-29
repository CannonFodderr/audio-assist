class AudioAssist {
    private AC: any
    private ss: SpeechSynthesis
    private ac?: AudioContext
    private mGainNode?: GainNode
    private mOscNode?: OscillatorNode
    ttsActive: boolean
    constructor(AC: any, SS: any){
        this.AC = AC
        this.ss = SS
        this.ttsActive = false
    }
    async init (){
        audioAssist.ac = await new audioAssist.AC()
        if(audioAssist.ac){
            audioAssist.mGainNode = audioAssist.ac.createGain()
            audioAssist.mGainNode.gain.setValueAtTime(0.5, audioAssist.ac.currentTime)
            audioAssist.mGainNode.connect(audioAssist.ac.destination)
        }
        await audioAssist.addListeners()
    }
    async reset(){
        if(audioAssist.ac){
            audioAssist.ac.close()
        }
        await audioAssist.removeListeners()
    }
    debounce = (func: any, delay:number = 300) => {
        let timer: any
        return (...args: any) => {
            clearTimeout(timer)
            timer = setTimeout(() => { func(...args) }, delay)
        }
    }
    speakHandler = this.debounce(this.speak, 300)
    removeListeners(){
        let elem: NodeList = document.body.querySelectorAll('*')
        elem.forEach(element => {
            element.removeEventListener('mouseenter', audioAssist.handleMouseEnter)
            element.removeEventListener('keyup', audioAssist.handleKeyup)
            audioAssist.ttsActive = false
        })
    }
    handleMouseEnter(e: any){
            audioAssist.handleHtmlTags(e)
    }
    handleHtmlTags(e: any){
        const isRequired = e.target.required ? "Required" : ""
        if(e.target.tagName === "INPUT" && e.target.type !== "checkbox"){
            const value = e.target.value ? e.target.value : e.target.placeholder
            const text = `${isRequired}, ${e.target.tagName}, ${value}`
            audioAssist.speakHandler(text)
        } else if(e.target.tagName === "INPUT" && e.target.type === "checkbox"){
            const isChecked = e.target.checked ? "Checked" : "Not checked"
            const text = `${isChecked}, ${isRequired}, ${e.target.type}, ${e.target.placeholder}`
            audioAssist.speakHandler(text)
        } else if (e.target.tagName === "SELECT"){
            const text = `${e.target.tagName}, ${e.target.value}`
            audioAssist.speakHandler(text)
        }else {
            audioAssist.speakHandler(e.target.textContent)
        }
    }
    handleKeyup(e: any){
        switch(e.which){
            case 9: audioAssist.handleHtmlTags(e)
            break
            case 13: audioAssist.handleHtmlTags(e)
            break
            case 32: audioAssist.handleHtmlTags(e)
            break
            case 38: audioAssist.handleHtmlTags(e)
            break
            case 40: audioAssist.handleHtmlTags(e)
            break
        }
    }
    addListeners(){
        let elem: NodeList = document.body.querySelectorAll('*')
        elem.forEach(element => {
            element.addEventListener('mouseenter', audioAssist.handleMouseEnter)
            element.addEventListener('keyup', audioAssist.handleKeyup)
            audioAssist.ttsActive = true
        })
    }
    playTone(stopAfter: number = 2000){
        if(!audioAssist.ac || !audioAssist.mGainNode) return
        if(audioAssist.mOscNode){
            audioAssist.mOscNode.stop()
        }
        audioAssist.mOscNode = audioAssist.ac.createOscillator()
        audioAssist.mOscNode.connect(audioAssist.mGainNode)
        audioAssist.mOscNode.start()
        if(stopAfter){
            setTimeout(() => { 
                if(audioAssist.mOscNode){
                    audioAssist.mOscNode.stop()
                }
            }, stopAfter)
        }
    }
    test(): void{
        if(!audioAssist.ac || !audioAssist.mGainNode) {
            audioAssist.init()
            .then(() => audioAssist.playTone(1000))
            .catch(err => console.error(err))
            return
        } 
        audioAssist.playTone(1000)
    }
    testSpeech(): void{
        const greeting = "Hi, Speech synthesizer is working correctly"
        audioAssist.speak(greeting, 4)
    }
    constructSentence = (text: string) => {
        const words = text.split(" ")
        let reCostructed: string = ""
        words.forEach(word => {
            switch(word){
                case "TTS": reCostructed += `Text To Speech`
                break
                default: reCostructed += ` ${word}`
            }
        })
        return reCostructed
    }
    speak(text: string, voice: number = 4): void{
        if(!audioAssist.ttsActive) return
        if(audioAssist.ss.speaking){
            audioAssist.ss.cancel()
        }
        const sentences = text.split(/[\.\!\?\...]/g)
        sentences.forEach(sentence => {
            const reconstructed = audioAssist.constructSentence(sentence)
            const utter = new SpeechSynthesisUtterance(reconstructed)
            if(voice){
                const voices = audioAssist.ss.getVoices()
                utter.voice = voices[voice]
            }
            audioAssist.ss.speak(utter)
        })
    }
}

const audioAssist = new AudioAssist(this.AudioContext, this.speechSynthesis)
