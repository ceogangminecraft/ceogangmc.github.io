const twitchClientId = '594m04xucqhb8ej90nbxrqre0k7xq6';
const redirectUri = 'https://ceogangminecraft.github.io/eligibility'; 
const scope = 'user:read:subscriptions user:read:follows';
const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
const studytmeID = '601213281';
var currentPhraseIndex = 1;
var UserID, username, followedAt = null;
var followerEligible, subEligible = false;
var citePhrases = [
    "> R.I.P. Spice the snowman",
    "> Buildpa is building...",
    "> Don't bother stealing, Kyle is watching :]",
    "> Beware of lightning, firefighters are on vaction",
    "> Is Villager slavery legal in 2024?",
    "> Metro M1 is now open!!",
    "> Cherry mountain is overcrowded!",
    "> Removed Herobrine...?"
];

$(document).ready(function() {
    $('cite').text(citePhrases[Math.floor(Math.random() * citePhrases.length)]);
    setInterval(updateCite, 3000);


    $('#login').click(function() {
        window.location.href = authUrl;
        
    });

    if (window.location.hash) {
        const params = new URLSearchParams(window.location.hash);
        const accessToken = params.get('#access_token');
        history.replaceState(null, '', window.location.pathname);

        $.ajax({
            url: 'https://api.twitch.tv/helix/users',
            type: 'GET',
            async: false,
            headers: {
                'Client-ID': twitchClientId,
                'Authorization': `Bearer ${accessToken}`
            },
            success: function(response) {
                UserID = response.data[0].id;
                username = response.data[0].login;

            },
            error: function(xhr, status, error) {
                console.error('Error while retrieving general user informations', error);
            }
        });
        
        $.ajax({
            url: `https://api.twitch.tv/helix/channels/followed?user_id=${UserID}&broadcaster_id=${studytmeID}`,
            type: 'GET',
            async: false,
            headers: {
                'Client-ID': twitchClientId,
                'Authorization': `Bearer ${accessToken}`
            },
            success: function(response) {
                if(response.data.length != 0){
                    followedAt = response.data[0].followed_at;
                    if(checkDate(followedAt)){
                        followerEligible = true;
                    }
                }else{
                    console.log("User is not a follower");
                }
            },
            error: function(xhr, status, error) {
                console.error('Error while retrieving user informations:', error);
            }
        });


        $.ajax({
            url: `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${studytmeID}&user_id=${UserID}`,
            type: 'GET',
            async: false,
            headers: {
                'Client-ID': twitchClientId,
                'Authorization': `Bearer ${accessToken}`
            },
            success: function() {
                subEligible = true;
            },
            error: function(xhr, status, error) {
                console.log("User is not subbed");
            }
        });


        if(subEligible || followerEligible){
            $('.additional-info-eligible').show();
            $('.content').css('border-bottom','1px solid rgb(59 59 59)');
        }else{
            $('.additional-info-ineligible').show();
            $('.content').css('border-bottom','1px solid rgb(59 59 59)');
        }
    }
});


function checkDate(followedAt) {
    var today = new Date();
    var dataInput = new Date(followedAt.split('T')[0]);
    var timeRequired = new Date(dataInput);
    timeRequired.setMonth(timeRequired.getMonth() + 3);
    return today >= timeRequired;
}

function updateCite() {
    var nextPhraseIndex = (currentPhraseIndex + 1) % citePhrases.length;
    $('cite').fadeOut(400, function() {
        $(this).text(citePhrases[currentPhraseIndex]).fadeIn(400);
        currentPhraseIndex = nextPhraseIndex;
    });
}

