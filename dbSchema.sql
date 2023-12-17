CREATE TABLE Gender (
    GenderId SERIAL PRIMARY KEY,
    Gender VARCHAR(10) NOT NULL
);

CREATE TABLE Users (
    UserId SERIAL PRIMARY KEY,
   Username VARCHAR(255) UNIQUE NOT NULL,
   Interests VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    ReferralCode VARCHAR(255),
    ProfilePic VARCHAR(255),
    UserBio TEXT,
    GenderId SERIAL,
    DOB DATE,
    FOREIGN KEY (GenderId) REFERENCES Gender(GenderId)
);


CREATE TABLE Location (
    UserId SERIAL PRIMARY KEY,
    Country VARCHAR(255),
    City VARCHAR(255),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Profile (
    UserId SERIAL PRIMARY KEY,
    Following INT,
    Followers INT,
    GoldStatus BOOLEAN,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE PaymentMethod (
    UserId SERIAL PRIMARY KEY,
    PaymentName VARCHAR(255),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
CREATE TABLE EventCategories (
    CategoryId SERIAL PRIMARY KEY,
    CategoryName VARCHAR(255)
);

CREATE TABLE Event (
    EventId SERIAL PRIMARY KEY,
    UserId SERIAL,
    EventName VARCHAR(255),
    EventDescription TEXT,
    EventAddress VARCHAR(255),
    EventDate DATE,
    EventStartTime TIME,
    EventEndTime TIME,
    CategoryId SERIAL,
    NumOfGuest INT,
    EventImg VARCHAR(255),
    IsPaypal BOOLEAN,
    MinAge INT,
    MaxAge INT,
    CashPaymentOnEntry BOOLEAN,
    PriceOfEvent DECIMAL(10, 2),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (CategoryId) REFERENCES EventCategories(CategoryId)
);


CREATE TABLE EventReviews (
    EventId SERIAL,
    UserId SERIAL,
    Reviews TEXT,
    PRIMARY KEY (EventId, UserId),
    FOREIGN KEY (EventId) REFERENCES Event(EventId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE BlogCategories (
    CategoryId SERIAL PRIMARY KEY,
    CategoryName VARCHAR(255)
);

CREATE TABLE Blog (
    BlogId SERIAL PRIMARY KEY,
    UserId SERIAL,
    BlogTitle VARCHAR(255),
    SocialLink VARCHAR(255),
    VideoLink VARCHAR(255),
    Description TEXT,
    NumberOfLikes INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE BlogImages (
    ImageId SERIAL PRIMARY KEY,
    BlogId SERIAL,
    ImageUrl VARCHAR(255),
    FOREIGN KEY (BlogId) REFERENCES Blog(BlogId)
);

CREATE TABLE Advert (
    AdvertId SERIAL PRIMARY KEY,
    AdvertTitle VARCHAR(255),
    AdvertImg VARCHAR(255),
    AdvertDesc TEXT,
    AdvertAddress VARCHAR(255),
    StartTime TIME,
    Date DATE,
    MinAge INT,
    MaxAge INT,
    MinDistance INT,
    MaxDistance INT,
    Reach INT,
    PotentialReach INT,
    FirstCallToAction VARCHAR(255),
    FirstCallToActionLink VARCHAR(255),
    SecondCallToAction VARCHAR(255),
    SecondCallToActionLink VARCHAR(255)
);

CREATE TABLE Comments (
    CommentId SERIAL PRIMARY KEY,
    BlogId SERIAL,
    UserId SERIAL,
    Comment TEXT,
    ParentCommentId SERIAL,
    FOREIGN KEY (BlogId) REFERENCES Blog(BlogId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ParentCommentId) REFERENCES Comments(CommentId)
);



