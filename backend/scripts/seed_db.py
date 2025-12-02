"""
Idempotent database seeding script for Gator Marketplace.

Creates 5 users (2 admins, 3 regular users) and 100 items (20 per category).
Safe to run multiple times - skips existing users and items.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from sqlmodel import Session, select
from backend.database import engine
from backend.models import User, Item
from backend.security import get_password_hash


# Category to image URL mapping
CATEGORY_IMAGES = {
    "school": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    "apparel": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    "living": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    "services": "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400",
    "tickets": "https://images.unsplash.com/photo-1594608661623-aa0bd8a69762?w=400",
}

# Seed users configuration
SEED_USERS = [
    {"email": "admin1@ufl.edu", "username": "admin1", "password": "Passw0rd1!", "is_admin": True},
    {"email": "admin2@ufl.edu", "username": "admin2", "password": "Passw0rd2!", "is_admin": True},
    {"email": "user1@ufl.edu", "username": "user1", "password": "UserPass1!", "is_admin": False},
    {"email": "user2@ufl.edu", "username": "user2", "password": "UserPass2!", "is_admin": False},
    {"email": "seed_owner@ufl.edu", "username": "seed_owner", "password": "SeedPass!", "is_admin": False},
]

# Item templates by category (title prefix, price range)
ITEM_TEMPLATES = {
    "school": [
        ("Intro to CS Textbook", 45, 120),
        ("Calculus Textbook", 50, 100),
        ("Biology Lab Manual", 25, 60),
        ("Chemistry Study Guide", 20, 45),
        ("Physics Notebook Set", 15, 30),
        ("Graphing Calculator", 60, 100),
        ("Scientific Calculator", 25, 40),
        ("Lab Coat", 30, 50),
        ("Anatomy Atlas", 40, 80),
        ("Programming Guide", 35, 70),
        ("Statistics Textbook", 45, 90),
        ("Engineering Handbook", 50, 95),
        ("Art Supplies Kit", 30, 60),
        ("Literature Anthology", 35, 65),
        ("Psychology Textbook", 40, 85),
        ("Economics Workbook", 30, 55),
        ("History Reference", 25, 50),
        ("Language Dictionary", 20, 45),
        ("Math Solutions Manual", 35, 70),
        ("Science Lab Kit", 40, 75),
    ],
    "apparel": [
        ("UF T-Shirt", 15, 25),
        ("Gators Hoodie", 30, 50),
        ("UF Baseball Cap", 12, 20),
        ("Spirit Jersey", 35, 55),
        ("Sweatpants", 20, 35),
        ("Athletic Shorts", 15, 28),
        ("Polo Shirt", 20, 40),
        ("Windbreaker Jacket", 35, 60),
        ("Tank Top", 12, 22),
        ("Long Sleeve Tee", 18, 30),
        ("Zip-Up Hoodie", 32, 55),
        ("Track Jacket", 28, 48),
        ("Sweatshirt", 25, 45),
        ("Flannel Shirt", 22, 38),
        ("Denim Jacket", 40, 70),
        ("Beanie", 10, 18),
        ("Scarf", 12, 22),
        ("Backpack", 35, 65),
        ("Gym Bag", 20, 40),
        ("Socks Pack", 10, 18),
    ],
    "living": [
        ("Mini Fridge", 60, 120),
        ("Desk Lamp", 15, 35),
        ("Study Desk", 50, 100),
        ("Office Chair", 45, 90),
        ("Bed Frame", 80, 150),
        ("Mattress Topper", 40, 75),
        ("Nightstand", 30, 60),
        ("Bookshelf", 35, 70),
        ("Floor Lamp", 25, 50),
        ("Bean Bag Chair", 30, 60),
        ("Coffee Table", 40, 80),
        ("TV Stand", 45, 85),
        ("Storage Bins Set", 20, 40),
        ("Laundry Basket", 15, 25),
        ("Shower Caddy", 12, 22),
        ("Bedding Set", 35, 65),
        ("Curtains", 20, 40),
        ("Area Rug", 30, 60),
        ("Mirror", 25, 45),
        ("Hangers Pack", 10, 20),
    ],
    "services": [
        ("Tutoring - Calculus", 20, 40),
        ("Tutoring - Chemistry", 20, 40),
        ("Tutoring - Physics", 25, 45),
        ("Essay Editing", 15, 30),
        ("Resume Review", 20, 35),
        ("Math Tutoring", 20, 40),
        ("Programming Help", 30, 50),
        ("Language Tutoring", 25, 45),
        ("Test Prep Session", 30, 55),
        ("Study Group Leader", 15, 30),
        ("Homework Help", 15, 35),
        ("Lab Report Editing", 20, 40),
        ("Presentation Practice", 15, 30),
        ("Writing Workshop", 25, 45),
        ("Career Counseling", 30, 50),
        ("Interview Prep", 25, 45),
        ("Photography Session", 40, 80),
        ("Graphic Design", 35, 70),
        ("Web Design Help", 40, 75),
        ("Music Lessons", 30, 60),
    ],
    "tickets": [
        ("Football Game Tickets", 40, 80),
        ("Basketball Game Tickets", 25, 50),
        ("Baseball Game Tickets", 15, 30),
        ("Concert Tickets", 30, 70),
        ("Theater Show Tickets", 20, 45),
        ("Comedy Show Tickets", 15, 35),
        ("Music Festival Pass", 50, 80),
        ("Museum Pass", 10, 20),
        ("Movie Tickets", 10, 25),
        ("Sporting Event Tickets", 30, 60),
        ("Orchestra Tickets", 20, 40),
        ("Dance Performance", 15, 35),
        ("Art Exhibition Pass", 12, 25),
        ("Guest Lecture Tickets", 10, 20),
        ("Workshop Pass", 15, 30),
        ("Seminar Access", 20, 40),
        ("Conference Tickets", 30, 60),
        ("Game Night Pass", 10, 20),
        ("Club Event Tickets", 15, 30),
        ("Social Event Pass", 12, 25),
    ],
}


def create_seed_users(session: Session) -> dict[str, User]:
    """Create seed users if they don't exist. Returns dict of email -> User."""
    users = {}
    created_count = 0
    
    for user_data in SEED_USERS:
        # Check if user already exists
        existing_user = session.exec(
            select(User).where(User.email == user_data["email"])
        ).first()
        
        if existing_user:
            print(f"✓ User {user_data['email']} already exists (ID: {existing_user.id})")
            users[user_data["email"]] = existing_user
        else:
            # Create new user
            new_user = User(
                username=user_data["username"],
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                is_admin=user_data["is_admin"]
            )
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            users[user_data["email"]] = new_user
            created_count += 1
            admin_label = " (ADMIN)" if user_data["is_admin"] else ""
            print(f"✓ Created user {user_data['email']}{admin_label} (ID: {new_user.id})")
    
    print(f"\n📊 Users Summary: {created_count} created, {len(SEED_USERS) - created_count} already existed\n")
    return users


def create_seed_items(session: Session, users: dict[str, User]):
    """Create 100 seed items (20 per category) if they don't exist."""
    
    # Distribute items across users (20 each)
    user_emails = [
        "admin1@ufl.edu",
        "admin2@ufl.edu",
        "user1@ufl.edu",
        "user2@ufl.edu",
        "seed_owner@ufl.edu"
    ]
    
    categories = ["school", "apparel", "living", "services", "tickets"]
    category_stats = {cat: {"created": 0, "existing": 0} for cat in categories}
    
    item_counter = 1
    
    for category in categories:
        templates = ITEM_TEMPLATES[category]
        category_image = CATEGORY_IMAGES[category]
        
        for i in range(20):  # 20 items per category
            # Round-robin user assignment
            user_email = user_emails[i % 5]
            user = users[user_email]
            
            # Get template (cycle through available templates)
            template = templates[i % len(templates)]
            title_base, price_min, price_max = template
            
            # Create unique title with seed marker
            title = f"{title_base} — Seed #{item_counter}"
            
            # Calculate price (distribute evenly across range)
            price_fraction = (i % len(templates)) / max(len(templates) - 1, 1)
            price = round(price_min + (price_max - price_min) * price_fraction, 2)
            
            # Check if item already exists (by unique title)
            existing_item = session.exec(
                select(Item).where(Item.title == title)
            ).first()
            
            if existing_item:
                category_stats[category]["existing"] += 1
            else:
                # Create new item
                new_item = Item(
                    title=title,
                    description=f"{title_base} for {category} category. High quality and great condition!",
                    price=price,
                    category=category,
                    image=category_image,
                    is_active=True,
                    seller_id=user.id
                )
                session.add(new_item)
                category_stats[category]["created"] += 1
            
            item_counter += 1
    
    # Commit all items at once
    session.commit()
    
    # Print statistics
    print("📦 Items Summary by Category:")
    print("-" * 50)
    total_created = 0
    total_existing = 0
    for category in categories:
        created = category_stats[category]["created"]
        existing = category_stats[category]["existing"]
        total = created + existing
        total_created += created
        total_existing += existing
        print(f"  {category.capitalize():12} | Created: {created:2} | Existing: {existing:2} | Total: {total:2}")
    
    print("-" * 50)
    print(f"  {'TOTAL':12} | Created: {total_created:2} | Existing: {total_existing:2} | Total: {total_created + total_existing:2}")
    
    # Print by user
    print("\n👥 Items Summary by User:")
    print("-" * 50)
    for email in user_emails:
        user = users[email]
        items_count = len(session.exec(select(Item).where(Item.seller_id == user.id)).all())
        admin_label = " (ADMIN)" if user.is_admin else ""
        print(f"  {email:25} | Items: {items_count:2}{admin_label}")
    print("-" * 50)


def main():
    """Main seeding function."""
    print("=" * 60)
    print("🌱 Starting Database Seed Script")
    print("=" * 60)
    print()
    
    with Session(engine) as session:
        # Create users
        print("👤 Creating/Verifying Seed Users...")
        print("-" * 50)
        users = create_seed_users(session)
        
        # Create items
        print("📦 Creating/Verifying Seed Items...")
        print("-" * 50)
        create_seed_items(session, users)
    
    print()
    print("=" * 60)
    print("✅ Seed Script Complete!")
    print("=" * 60)
    print()
    print("You can now:")
    print("  - Login with any of the following users:")
    for user_data in SEED_USERS:
        admin_label = " (ADMIN)" if user_data["is_admin"] else ""
        print(f"    • {user_data['email']:25} | Password: {user_data['password']}{admin_label}")
    print()


if __name__ == "__main__":
    main()
