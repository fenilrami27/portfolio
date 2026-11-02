"""
Generate high-fidelity OG images, favicons, and QR codes for Fenil Rami's portfolio.
"""

from pathlib import Path

import qrcode
import qrcode.image.svg
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_PUBLIC = BASE_DIR.parent / "frontend" / "public"
PORTFOLIO_ASSETS = BASE_DIR.parent / "portfolio-assets"

FRONTEND_PUBLIC.mkdir(parents=True, exist_ok=True)
PORTFOLIO_ASSETS.mkdir(parents=True, exist_ok=True)

# ------------------------------------------------------------------------------
# 1. Generate Favicons (32x32, 180x180, 192x192, 512x512)
# ------------------------------------------------------------------------------
def create_monogram_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (11, 14, 20, 255))
    draw = ImageDraw.Draw(img)
    
    # Draw rounded rectangle / border
    pad = int(size * 0.08)
    corner = int(size * 0.22)
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=corner,
        fill=(20, 27, 45, 255),
        outline=(59, 130, 246, 255),
        width=max(1, int(size * 0.04))
    )
    
    # Text "FR"
    try:
        font_size = int(size * 0.45)
        font = ImageFont.truetype("arialbd.ttf", font_size)
    except Exception:
        font = ImageFont.load_default()
        
    text = "FR"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) // 2
    y = (size - th) // 2 - int(size * 0.05)
    
    # Draw gradient-like glow
    draw.text((x, y), text, font=font, fill=(96, 165, 250, 255))
    return img

print("Generating favicons...")
icon_32 = create_monogram_icon(32)
icon_32.save(FRONTEND_PUBLIC / "favicon-32x32.png")

icon_180 = create_monogram_icon(180)
icon_180.save(FRONTEND_PUBLIC / "apple-touch-icon.png")

icon_192 = create_monogram_icon(192)
icon_192.save(FRONTEND_PUBLIC / "icon-192.png")

icon_512 = create_monogram_icon(512)
icon_512.save(FRONTEND_PUBLIC / "icon-512.png")

# ------------------------------------------------------------------------------
# 2. Generate 1200x630 Open Graph Images
# ------------------------------------------------------------------------------
def create_og_image(title: str, subtitle: str, tag: str, filename: str):
    w, h = 1200, 630
    img = Image.new("RGB", (w, h), (11, 14, 20))
    draw = ImageDraw.Draw(img)
    
    # Background subtle grid / accents
    for x in range(0, w, 60):
        draw.line([(x, 0), (x, h)], fill=(18, 24, 38), width=1)
    for y in range(0, h, 60):
        draw.line([(0, y), (w, y)], fill=(18, 24, 38), width=1)
        
    # Card container
    draw.rounded_rectangle([60, 60, w - 60, h - 60], radius=24, fill=(15, 21, 33), outline=(40, 50, 75), width=2)
    
    # Monogram logo badge
    draw.rounded_rectangle([110, 110, 180, 180], radius=16, fill=(37, 99, 235), outline=(96, 165, 250), width=2)
    try:
        badge_font = ImageFont.truetype("arialbd.ttf", 36)
    except Exception:
        badge_font = ImageFont.load_default()
    draw.text((126, 122), "FR", font=badge_font, fill=(255, 255, 255))
    
    # Tag chip
    try:
        tag_font = ImageFont.truetype("arialbd.ttf", 20)
        title_font = ImageFont.truetype("arialbd.ttf", 52)
        sub_font = ImageFont.truetype("arial.ttf", 26)
        footer_font = ImageFont.truetype("arialbd.ttf", 22)
    except Exception:
        tag_font = ImageFont.load_default()
        title_font = ImageFont.load_default()
        sub_font = ImageFont.load_default()
        footer_font = ImageFont.load_default()
        
    draw.rounded_rectangle([205, 125, 480, 165], radius=8, fill=(30, 41, 59), outline=(59, 130, 246), width=1)
    draw.text((220, 133), tag.upper(), font=tag_font, fill=(96, 165, 250))
    
    # Main Title
    draw.text((110, 230), title, font=title_font, fill=(248, 250, 252))
    
    # Subtitle / description
    draw.text((110, 315), subtitle, font=sub_font, fill=(148, 163, 184))
    
    # Tech stack strip at bottom
    draw.line([(110, 460), (w - 110, 460)], fill=(40, 50, 75), width=1)
    draw.text((110, 495), "Python · Django · React · PostgreSQL · REST APIs", font=footer_font, fill=(56, 189, 248))
    draw.text((w - 340, 495), "fenilrami.com", font=footer_font, fill=(148, 163, 184))
    
    # Save to public and assets
    img.save(FRONTEND_PUBLIC / filename, quality=92)
    (PORTFOLIO_ASSETS / "01-personal").mkdir(parents=True, exist_ok=True)
    img.save(PORTFOLIO_ASSETS / "01-personal" / filename, quality=92)
    print(f"Generated {filename}")

print("Generating Open Graph banners...")
create_og_image(
    title="FENIL RAMI",
    subtitle="Python Backend & Full Stack Developer\nEnterprise Business Systems · Role-Based Architecture",
    tag="Portfolio & Case Studies",
    filename="og-image.png"
)

create_og_image(
    title="CMHP – Pharmaceutical ERP",
    subtitle="Dual-Company Manufacturing ERP Frontend\nDigital Batch Manufacturing Records (BMR) & Stock Ledgers",
    tag="Case Study · React & Redux",
    filename="og-cmhp-pharma-erp.png"
)

create_og_image(
    title="HR University Portal & Backend",
    subtitle="Interactive University Web Portal & Modular Django 5 REST Backend\n11 Apps · 32 Relational Models · 38 REST Endpoints",
    tag="Case Study · Django & React",
    filename="og-hr-university.png"
)

create_og_image(
    title="Interior Design Studio",
    subtitle="Dynamic Architecture Showcase & Project Gallery\nOTP-Verified Password Recovery & Admin Curation",
    tag="Case Study · Django",
    filename="og-interior-design-studio.png"
)

# ------------------------------------------------------------------------------
# 3. Generate QR Codes for fenilrami.com
# ------------------------------------------------------------------------------
portfolio_url = "https://fenilrami.com"

# PNG QR Code
qr_png = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=2,
)
qr_png.add_data(portfolio_url)
qr_png.make(fit=True)
img_qr_png = qr_png.make_image(fill_color="#0f172a", back_color="#ffffff")
img_qr_png.save(FRONTEND_PUBLIC / "qr-portfolio.png")
img_qr_png.save(PORTFOLIO_ASSETS / "qr-portfolio.png")
print("Generated qr-portfolio.png")

# SVG QR Code
qr_svg = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=10,
    border=2,
    image_factory=qrcode.image.svg.SvgImage
)
qr_svg.add_data(portfolio_url)
qr_svg.make(fit=True)
img_qr_svg = qr_svg.make_image()
img_qr_svg.save(str(FRONTEND_PUBLIC / "qr-portfolio.svg"))
img_qr_svg.save(str(PORTFOLIO_ASSETS / "qr-portfolio.svg"))
print("Generated qr-portfolio.svg")

print("All visual assets successfully generated!")
