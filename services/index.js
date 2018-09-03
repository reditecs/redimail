"use strict"
/*
function diff_minutes(dt2, dt1){
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
*/
function diff_minutes(old){
  
  let recentDate = new Date()
  
  let oldSeconds = Math.round(old.getTime()/1000) 
  let recentSeconds = Math.round(recentDate.getTime()/1000)
  
  let diffSeconds = recentSeconds-oldSeconds
  
  let diffMinutes = diffSeconds/60
  
  return Math.round(diffMinutes)
  
}

module.exports = {
  diff_minutes
}