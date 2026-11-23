--Readme document for *Olivia Sismaet*, *osismaet@uci.edu*, *osismaet*--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

9/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 1/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
To estimate, a little less than 13 hours


3. What online resources did you consult when completing this assignment? (list specific URLs)
Used AI for help with specific Ionic formatting questions, and help with setting up the persistent storage.


4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
N/A, did not consult other classmates/individuals


5. Is there anything special we need to know in order to run your code?
N/A


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
Since I am a college student, I made it with college students in mind who might be on the busier side
and not have time to comprehensively log their sleep. I thought by adding features like the real-time sleep tracker
and the sleepiness log on the home page would make the program more accessible and not intrusive on their daily routines.

7. Did you design your app specifically for iOS or Android, or both?
Mainly iOS, since I am an iOS and MacOS user, I'm more familiar with the Apple design conventions.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
The user has two options, either manually logging a sleep or choosing to run a real-time sleep session that they start
when they go to sleep and end when they wake up. I added the sleep session because I think it's easier than inputting values,
especially if users can't remember the exact times they went to sleep or woke up, but kept a manual option in case users forget to 
do a sleep session. 

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
The sleepiness logger is on the home page, so they can easily open the app and immediately log their sleepiness using
a slider scale 1-7. The user will log their sleep in increments to keep sleep logs consistent across days.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
There is a logs page where the user can cycle through past days and see logs for each day. Sleepiness and sleep logs are displayed
at the same time so the user can easily see the information all at once. 


11. Which feature choose--using a native device resource, backing up logged data, or both?
Backing up logged data.


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
N/A


13. If you backed up logged data, where does it back up to?
The data is backed up with Ionic Storage, which saves to the browser's IndexedDB on the user's own device.
The data that is persistent across sessions includes sleep, sleepiness, and, if there's an active sleep session happening, the running clock. 

14. How does your app implement or follow principles of good mobile design?
My app supports the design principles discussed in class, with a useful intial view of the user's most recent sleep
and access to logging their sleepiness. In addition incorporates room for "uh-ohs" by asking the user for confirmation before they
do certain actions (like ending a sleep) and offering undos for other actions (deleting a log). Error prevention is always used
to prevent invalid sleeps from being recorded.