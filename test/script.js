var initBTN = document.getElementById('as-init')
var volumeSlider = document.getElementById('volume')
var pitchSlider = document.getElementById('pitch')
var voiceSelector = document.getElementById('voices')
var rateSlider = document.getElementById('rate')

voiceSelector.addEventListener('change', (e) => {
    if(isNaN(e.target.value)) return 
    audioAssist.setVoice(e.target.value)
})
volumeSlider.addEventListener('change', (e) => {
    audioAssist.setVolume(e.target.value)
})
pitchSlider.addEventListener('change', (e) => {
    audioAssist.setPitch(e.target.value)
})
rateSlider.addEventListener('change', (e) => {
    audioAssist.setRate(e.target.value)
})
initBTN.onclick = () => {
    if(!audioAssist.ttsActive){
        audioAssist.init()
        initBTN.innerText = "Stop TTS"
    } else {
        audioAssist.reset()
        initBTN.innerText = "Start TTS"
    }
}