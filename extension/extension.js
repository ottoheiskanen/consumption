// when page is loaded, start tracking the time spent on site when its active and send it to the server
window.onload = function() {
    let start = new Date();
    let timeSpent = 0;
    let interval = setInterval(function() {
        timeSpent = new Date() - start;
        console.log(timeSpent);
        //send timeSpent to server
        chrome.runtime.sendMessage({timeSpent: timeSpent});
    }, 5000);
}



//when page is loaded, start tracking the time spent on site and send it to the server
// window.onload = function() {
//     let start = new Date();
//     let timeSpent = 0;
//     let interval = setInterval(function() {
//         timeSpent = new Date() - start;
//         console.log(timeSpent);
//         //send timeSpent to server

//     }, 5000);
// }