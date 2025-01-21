class AudioManager {
    constructor() {
        this.audios = new Map([
            ["ballCollision", new Audio("../assets/audio/sound_effect/ball_collision.wav")],
            ["shot", new Audio("../assets/audio/sound_effect/shot.wav")],
            ["goal", new Audio("../assets/audio/sound_effect/goal.wav")],
            ["wrong", new Audio("../assets/audio/sound_effect/wrong.wav")],
        ]);
        this.musics = new Map([
            ["mainTheme", new Audio("../assets/audio/music/main_theme.wav")],
        ]);
        this.musicVolume = 0.5;
        this.soundEffectVolume = 0.5;
    };

    static manager = new AudioManager();

    playAudio(audioName) {
        this.audios.get(audioName).play();
    }

    playMusic(musicName) {
        for (let music of this.musics.values()) {
            music.pause();
            music.currentTime = 0;
        }
        const audio = this.musics.get(musicName);
        audio.volume = this.musicVolume;
        audio.play();
        audio.loop = true;
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        for (let music of this.musics.values()) {
            music.volume = volume;
        }
    }

    setSoundEffectVolume(volume) {
        this.soundEffectVolume = volume;
        for (let audio of this.audios.values()) {
            audio.volume = volume;
        }
    }
}
export { AudioManager };