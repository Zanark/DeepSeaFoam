"""Prepare a bounded, full-composition WebP preview of the photographic inspiration."""

import argparse
import hashlib
import json
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageCms, ImageOps


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--width", type=int, default=800)
    parser.add_argument("--quality", type=int, default=65)
    args = parser.parse_args()
    if args.width < 1 or not 0 <= args.quality <= 100:
        parser.error("Width must be positive and quality must be between 0 and 100.")
    if args.source.resolve() == args.destination.resolve() or args.destination.exists():
        parser.error("The source and any existing destination must not be overwritten.")

    with Image.open(args.source) as source:
        source_size = source.size
        image = ImageOps.exif_transpose(source)
        profile = source.info.get("icc_profile")
        if profile:
            image = ImageCms.profileToProfile(
                image, ImageCms.ImageCmsProfile(BytesIO(profile)),
                ImageCms.createProfile("sRGB"), outputMode="RGB",
            )
        else:
            image = image.convert("RGB")
    width = min(args.width, image.width)
    image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
    encoded = BytesIO()
    image.save(encoded, "WEBP", quality=args.quality, method=6)
    output = encoded.getvalue()
    if len(output) > 48 * 1024:
        parser.error("Preview exceeds its 48 KiB allowance; reduce width or quality.")
    args.destination.parent.mkdir(parents=True, exist_ok=True)
    with args.destination.open("xb") as destination:
        destination.write(output)
    print(json.dumps({
        "sourceSha256": hashlib.sha256(args.source.read_bytes()).hexdigest(),
        "sourceSize": source_size,
        "outputSize": image.size,
        "quality": args.quality,
        "bytes": len(output),
        "sha256": hashlib.sha256(output).hexdigest(),
    }))


if __name__ == "__main__":
    main()
