# Slutprojekt

## Environment & Tools
macOS Catalina
Visual Studio Code
Firefox Developer Edition
Affinity Designer
Source Tree 

## Purpose:
The project aims to produce a sort of webapplication where the user can test his typing capabilities measured both in precision and speed.
The application is very javascript heavy to be able to create all the necessary functions. 
The game should be very interactive visual feedback so that the user know how he is doing. It is important to highlight where the user is in the text and give visual feedback if he is typing the right chars. It is also important to highlight if the user has entered an incorrect char. This is done with audio and visually by setting the char to red.
The game should provice stats in different forms to measure the performance. 

## Procedures: 
The page is composed of a dropdown which fetches all the texts from a xml file.
Two checkboxes are present which can be used to determine if the texts shown should be in English or Swedish. Choosing a new language updates the dropdown with texts in that language.
There is also a checkbox which is used to toggle the use of casing on or off when writing the text into the input field.

Below is a section with the title of the chosen text and below that the author, the number of words and number of chars.
The text is also present in this same section. When playing the game, the char which should be typed turns yellow and if you type the correct char then it turns slightly beige and if you type a not correct char then it turns red. This was accomplished with the help of span.

There is a input box below which takes the input of the user and processes it by comparing it to the expected result and then displays the outcome into the text above. If the expected result is not correct then a sound is played.

A start/stop button is present which resets and starts or stops the game. The button changes appearance as it is an image with the help of element.src and then pointing towards an image in the project.

At the bottom we find the stats area where different statistics are calculated with the help of a timer for example. We are also drawing a graph of how it is going with the help of canvas.

## Discussion: 
This was a very fun project to do with a lot of challenges.  One was that backspace should not be considered and in the beggining I was quite annoyed as you could type backspace and then the text was updated so I created a an if check to ignore backspaces completely from the input field.
I learnt a lot about what javascript can accomplish and how to do it in different ways. I think I have redone this task 3-4 time because I found new "better" ways to do it in.