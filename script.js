var numSigns = 0;
function addSign(text) {
    $("#trackbed").append($("<div class='democracy-sign'></div>").html(text));
    $("#trackbed").append($("<div></div>").css({
        height: '1px',
        width: '100em'
    }));
    numSigns++;
}

var lastPosition = 0;
var viewedSigns = 0;

var speedFactor = 0.4;
var delta = 0;
var moveInterval = null;
var currentPosition;
function animateTrain(sign, shouldAnimate) {
    if(shouldAnimate == undefined)
        shouldAnimate = true;
    if(shouldAnimate)
        viewedSigns++;
    newPosition = $(sign).position().left + $(sign).outerWidth() - $("#train").outerWidth(); /*+ $(currentLocomotive).outerWidth() + (em[0] * 6);*/
    console.log("Animate to " + newPosition);
    var duration = (Math.abs(newPosition-lastPosition)/(em[0]*3))*speedFactor*1000;
    if(!shouldAnimate)
        duration = 0;
    console.log(duration);
    function done() {
        moveInterval = null;
        particleEmissionRate = 100;
        if(viewedSigns < numSigns && shouldAnimate)
            $("#next-button").addClass("show");
    }
    $("#train").transition({
        x: newPosition,
        complete: done,
        duration: duration
    });
    var signLeft = sign.getBoundingClientRect().left + worldContainer.scrollLeft;
    var waitTime = 1000;
    if(!shouldAnimate)
        waitTime = 0;
    setTimeout(function() {
        $("#world-container").animate({
            scrollLeft: signLeft - (($(document.body).outerWidth() - $(sign).outerWidth()) / 2)
        }, {
            duration: ((duration-waitTime) * (5/6))
        })
    }, waitTime);
    
    moveInterval = shouldAnimate;
    lastPosition = newPosition;
    /*
    var maxSpeed = 20;
    var speed = 1;
    var speedInterval = setInterval(function() {
        if(speed < maxSpeed)
            speed += 1;
        else
            clearInterval(speedInterval);
    }, 500);
    moveInterval = setInterval(function() {
        lastPosition += speed*speedFactor;
        $("#train").css("transform", "translateX(" + lastPosition + "px)");
        
    }, 10);
    */
    particleEmissionRate = 10;
}
$.fn.toEm = function(settings){
    settings = jQuery.extend({
        scope: 'body'
    }, settings);
    var that = parseInt(this[0],10),
        scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
        scopeVal = scopeTest.height();
    scopeTest.remove();
    return (that / scopeVal);
};
function getSignEms(sign) {
    var rect = sign.getBoundingClientRect();
    return $(rect.left + $("#world-container").scrollLeft() + (rect.width * 1.2)).toEm();
}
window.onresize = function() {
        window.location.reload(false);
};

var currentLocomotive, worldContainer;
var particleEmissionRate = 500;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function getDefaultFontSize(pa){
    pa= pa || document.body;
    var who= document.createElement('div');
   
    who.style.cssText='display:inline-block; padding:0; line-height:1; position:absolute; visibility:hidden; font-size:1em';
   
    who.appendChild(document.createTextNode('M'));
    pa.appendChild(who);
    var fs= [parseFloat(who.offsetWidth), parseFloat(who.offsetHeight)];
    pa.removeChild(who);
    return fs;
}
var em;
function emitLocoParticle() {
    var rect = currentLocomotive.getBoundingClientRect();
    var scrollLeft = $("#world-container").scrollLeft();
    var scrollTop = $("#world-container").scrollTop();
    var normalPosition = {
        x: scrollLeft + rect.left,
        y: scrollTop + rect.top
    };
    
    normalPosition.y -= em[1] * 3;
    normalPosition.x += rect.width / 1.5;

    var div = document.createElement("div");
    div.style.position = 'absolute';
    div.style.top = normalPosition.y + 'px';
    div.style.left = normalPosition.x + 'px';
    div.classList.add("emissions-particle");
    $("#trackbed").append(div);
    
    setTimeout(function() {
        div.parentNode.removeChild(div);
    }, getRandomInt(700, 900));
    
    setTimeout(emitLocoParticle, particleEmissionRate);
}
/*
function updateLocomotiveScroll() {
    if(moveInterval != null) {
        var trainRect = currentLocomotive.parentNode.getBoundingClientRect();
        var left = trainRect.left - (trainRect.width / 7) + worldContainer.scrollLeft;
        //worldContainer.scroll({ left: left, behavior: 'smooth' });
        
        worldContainer.scrollLeft = left;
        //currentLocomotive.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
    
    window.requestAnimationFrame(updateLocomotiveScroll);
}
*/
var signs = [
    [ 'The Code of King Hammurabi', '1792-1750 BC', "Whatever action is taken against another person will be done to them. For example, if I were to steal, something would be taken from me." ],
    [ 'Magna Carta', '1215 AD', "<ul>" +
            "<li>Justice is equally distributed to everyone.</li>" +
            "<li>No one should be accused of anything or punished without proof from other credible people.</li>" +
        "</ul>"
    ],
    [ 'Concerning Civil Government', '1689 AD', "<ul>" +
            "<li>People, by nature, are free to do anything that nature permits them to do.</li>" +
            "<li>In society, a person’s liberty is  determined by the governing body of that society.</li>" +
    "</ul>"],
    [ 'Declaration of the Rights of Man', '1789 AD', "<ul>" +
            "<li>Authority comes directly from the governing society a person lives in.</li>" +
            "<li>Liberty is freedom to do anything which does not impede the freedom of others. This is determined by law.</li>" +
    "</ul>"],
    [ '15th Amendment to the US Constitution', '1870 AD', 'A citizen’s right to vote in the US should not be determined by their race.' ],
    [ 'New Zealand Election Act', '1893 AD', 'All women in New Zealand are entitled to vote.' ],
    [ 'U.N. Universal Declaration of Human Rights', '1948 AD', 'All people should work to promote democracy and basic human rights.'],
    [ 'European Member States', '1992 AD', "All European Union countries agree to:<br/><ul>" + 
            "<li>Respect basic human rights.</li>" +
            "<li>Work together to develop the continent.</li>" +
    "</ul>"],

]
window.onload = function() {
    addSign("<h5>CHV2O Unit 1 Assignment</h5><p></p>Click the button on the right to move to the next station.");
    signs.forEach(function(sign) {
        addSign(
            "<h5>" + sign[0] + "</h5>" +
            "<h6>" + sign[1] + "</h6>" +
            "<p>" + sign[2] + "</p>"
        );
    });
    addSign("You've reached the end of the line.<p></p>Thanks for viewing!");
    for(var i = 0; i < 3; i++) {
        $("#train").append("<img src='old_steam_car.svg' class='traincar passenger-car'/>");
    }
    $("#train").append("<img src='big_boy.svg' class='traincar locomotive'/>");
    viewedSigns = 1;
    $("#next-button").click(function() {
        $("#next-button").removeClass("show");
        console.log("Go to sign " + viewedSigns);
        if(viewedSigns == 3) {
            $(".passenger-car").attr("src", "amfleet_sprite.svg");
            $(".locomotive").attr("src", "diesel.svg");
            speedFactor /= 2;
        }
        if(viewedSigns == 6) {
            $(".locomotive").attr("src", "electric.svg");
            $("#catenary-poles").show();
            $("#electric-wire").show();
            speedFactor /= 2;
        }
        if(moveInterval == null)
            animateTrain($(".democracy-sign")[viewedSigns]);
    });
    setTimeout(function() {
        $("#next-button").addClass("show");
    }, 1000);
    worldContainer = $("#world-container").get(0);
    currentLocomotive = $(".locomotive").get(0);
    em = getDefaultFontSize();
    /*emitLocoParticle();*/
    //updateLocomotiveScroll();
};