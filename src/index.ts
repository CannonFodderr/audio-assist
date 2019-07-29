class AudioAssist {
    private ss: SpeechSynthesis
    private selectedVoice: number
    private volume: number
    private pitch: number
    private rate: number
    private ttsActive: boolean
    constructor(SS: any){
        this.ss = SS
        this.ttsActive = false
        this.selectedVoice = 4
        this.volume = 1
        this.pitch = 1
        this.rate = 1
    }
    setVoice(value: number){
        const voices = this.ss.getVoices()
        value = value >= voices.length ? voices.length : value
        value = value < 0 ? 0 : value
        this.selectedVoice = value
        
    }
    setPitch(value: number){
        value = value > 2 ? 2 : value
        value = value < 0 ? 0 : value
        this.pitch = value
    }
    setVolume(value: number){
        value = value > 1 ? 1 : value
        value = value < 0 ? 0 : value
        this.volume = value
    }
    setRate(value: number){
        value = value > 2 ? 2 : value
        value = value < 0.1 ? 0.1 : value
        this.rate = value
    }
    async init (){
        await audioAssist.addListeners()
        this.ttsActive = true
    }
    async reset(){
        await audioAssist.removeListeners()
        this.ttsActive = false
    }
    debounce = (func: any, delay:number = 300) => {
        let timer: any
        return (...args: any) => {
            clearTimeout(timer)
            timer = setTimeout(() => { func(...args) }, delay)
        }
    }
    
    addListeners(){
        let elem: NodeList = document.body.querySelectorAll('*')
        elem.forEach(element => {
            element.addEventListener('mouseenter', audioAssist.handleMouseEnter)
            element.addEventListener('keyup', audioAssist.handleKeyup)
        })
    }
    removeListeners(){
        let elem: NodeList = document.body.querySelectorAll('*')
        elem.forEach(element => {
            element.removeEventListener('mouseenter', audioAssist.handleMouseEnter)
            element.removeEventListener('keyup', audioAssist.handleKeyup)
        })
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
    handleMouseEnter(e: any){
            audioAssist.handleHtmlTags(e)
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
    testSpeech = (): void => {
        const greeting = "Hi, Speech synthesizer is working correctly"
        audioAssist.speak(greeting, this.selectedVoice)
    }
    constructSentence = (text: string) => {
        const words = text.split(" ")
        let reCostructed: string = ""
        words.forEach(word => {
            switch(word){
                case "TTS": reCostructed += ` Text To Speech`
                break
                default: reCostructed += ` ${word}`
            }
        })
        return reCostructed
    }
    speak = (text: string, voice: number = this.selectedVoice): void => {
        if(audioAssist.ss.speaking){
            audioAssist.ss.cancel()
        }
        const sentences = text.split(/[\.\!\?\...]/g)
        sentences.forEach(sentence => {
            const reconstructed = audioAssist.constructSentence(sentence)
            const utter = new SpeechSynthesisUtterance(reconstructed)
            utter.pitch = audioAssist.pitch
            utter.volume = audioAssist.volume
            utter.rate = audioAssist.rate
            if(voice){
                const voices = audioAssist.ss.getVoices()
                utter.voice = voices[voice]
            }
            audioAssist.ss.speak(utter)
        })
    }
    speakHandler = this.debounce(this.speak, 300)
}

const audioAssist = new AudioAssist(this.speechSynthesis)
