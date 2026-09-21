"""Prepare the supplied, already-transparent blobfish illustration for the showcase."""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--width", type=int, default=640)
    parser.add_argument("--quality", type=int, default=82)
    args = parser.parse_args()
    if args.width < 1 or not 0 <= args.quality <= 100:
        parser.error("Width must be positive and quality must be between 0 and 100.")
    if args.source.resolve() == args.destination.resolve():
        parser.error("The source artwork must not be overwritten.")

    with Image.open(args.source) as source:
        if source.mode != "RGBA" or source.getchannel("A").getextrema()[0] != 0:
            parser.error("Expected the supplied RGBA artwork with a transparent background.")
        image = source.copy()
    source_size = image.size
    alpha = image.getchannel("A")
    connected = alpha.point(lambda value: 255 if value > 3 else 0)
    center = (image.width // 2, image.height // 2)
    if connected.getpixel(center) != 255:
        parser.error("Expected the blobfish to cover the center of the supplied illustration.")
    # Retain the central illustration, remove isolated background specks, and keep its soft fringe.
    ImageDraw.floodfill(connected, center, 128)
    connected = connected.point(lambda value: 255 if value == 128 else 0).filter(ImageFilter.MaxFilter(5))
    image.putalpha(ImageChops.multiply(alpha, connected))
    left, top, right, bottom = image.getchannel("A").getbbox()
    bounds = (max(0, left - 12), max(0, top - 12), min(image.width, right + 12), min(image.height, bottom + 12))
    image = image.crop(bounds)
    width = min(args.width, image.width)
    image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
    args.destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.destination, "WEBP", quality=args.quality, method=6)
    print(json.dumps({
        "sourceSha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
        "sourceSize": source_size,
        "crop": bounds,
        "outputSize": image.size,
        "quality": args.quality,
        "bytes": args.destination.stat().st_size,
        "sha256": hashlib.sha256(args.destination.read_bytes()).hexdigest()
    }))


if __name__ == "__main__":
    main()
