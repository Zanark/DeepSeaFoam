import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import wave


def main():
    parser = argparse.ArgumentParser(description="Encode the supplied WAV as an opt-in website MP3.")
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--ffmpeg", default="ffmpeg")
    args = parser.parse_args()
    if args.source.resolve() == args.output.resolve() or args.output.exists():
        parser.error("Choose a new output file; the source and existing outputs are never overwritten.")
    if args.output.suffix.lower() != ".mp3":
        parser.error("The output must be an MP3 file.")

    with wave.open(str(args.source), "rb") as source:
        channels = source.getnchannels()
        rate = source.getframerate()
        frames = source.getnframes()
        width = source.getsampwidth()
    if channels not in (1, 2) or frames == 0:
        parser.error("The source must be nonempty mono or stereo PCM WAV.")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        args.ffmpeg, "-hide_banner", "-loglevel", "error", "-n",
        "-i", str(args.source), "-map", "0:a:0", "-map_metadata", "-1",
        "-vn", "-c:a", "libmp3lame", "-b:a", "128k", "-ar", str(rate),
        str(args.output),
    ], check=True)
    original = args.source.read_bytes()
    encoded = args.output.read_bytes()
    print(json.dumps({
        "sourceSha256": hashlib.sha256(original).hexdigest(),
        "sourceBytes": len(original),
        "sourceChannels": channels,
        "sourceSampleRate": rate,
        "sourceSampleWidthBytes": width,
        "durationSeconds": frames / rate,
        "codec": "mp3",
        "bitRate": 128000,
        "bytes": len(encoded),
        "sha256": hashlib.sha256(encoded).hexdigest(),
    }, indent=2))


if __name__ == "__main__":
    main()
