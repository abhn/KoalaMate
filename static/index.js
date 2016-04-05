$(document).ready(() => {
    $('#searchBtn').on('click keyup', (e) => {
        let queryStr = $('#inputField').val();
        $('#askme-results').empty();
        $.post( 
            'http://localhost:1356/exists', 
            { query: queryStr }, 
            (data, status) => {
                if(data) {
                    console.log('local query');
                    // no xml parsing as above query returned native xml,
                    // Did you realize that I'm a genius?
                    let plainTexts = data.getElementsByTagName("plaintext");
                    for(i=1; i<plainTexts.length; i++) {
                        if(plainTexts[i].innerHTML) {
                            $('#askme-results').append('<li class="list-group-item">' + plainTexts[i].innerHTML + '</li>');
                        }
                    }
                } else {
                    console.log('remote query');
                    $.ajax({
                        url: 'http://api.wolframalpha.com/v2/query?appid=78XHRL-XXVL7TTG4U&input=' + queryStr,
                        success: (result) => {
                            let xmlResultSet = $($.parseXML(result));
                            let plainTexts = result.getElementsByTagName("plaintext");
                            for(i=1; i<plainTexts.length; i++) {
                                if(plainTexts[i].innerHTML) {
                                    $('#askme-results').append('<li class="list-group-item">' + plainTexts[i].innerHTML + '</li>');
                                }
                            }
                            // inserting into local database
                            let xmlString = (new XMLSerializer()).serializeToString(result);
                            let postData = { query: queryStr.toString(), data: xmlString };
                            $.post( 
                                'http://localhost:1356/add', 
                                postData, 
                                (data, status) => {
                                    console.log('inserted. Ouch!');
                                }
                            );
                        }
                    });
                }
            }
        );

    });
    
    // for history button
    $('#historyBtn').on('click', (e) => {
        $('#askme-results').empty();
        $.ajax({
            url: 'http://localhost:1356/history',
            success: (result) => {
                // I am literally writing this in a train dabba
                for(var i=0; i<result['data'].length; i++) {
                    $('#askme-results').append('<li class="list-group-item"><a href="#">' + result["data"][i]["query"].toUpperCase() + '</a></li>');
                }
            }
        });
    });
    
    $('#askme-results').on('click', (e) => {
        let query = e.target.innerHTML.toLowerCase();
        $('#askme-results').empty();
        $.post( 
            'http://localhost:1356/exists', 
            { query: query }, 
            (data, status) => {
                console.log('local query');
                // no xml parsing as above query returned native xml,
                // Did you realize that I'm a genius?
                let plainTexts = data.getElementsByTagName("plaintext");
                for(i=1; i<plainTexts.length; i++) {
                    if(plainTexts[i].innerHTML) {
                        $('#askme-results').append('<li class="list-group-item">' + plainTexts[i].innerHTML + '</li>');
                    }
                }
            }
        );
    });
    
    $('#clearBtn').on('click', (e) => {
         $('#askme-results').empty();
    });
});

// counter code
counter = () => {
    let value = $('#content').val();
    if (value.length == 0) {
        $('#w_count').html(0);
        return;
    }
    let regex = /\s+/gi;
    let w_count = value.trim().replace(regex, ' ').split(' ').length;
    $('#w_count').html(w_count);

};

// counter code
$(document).ready(() => {
    $('#content').change(counter);
    $('#content').keydown(counter);
    $('#content').keypress(counter);
    $('#content').keyup(counter);
    $('#content').blur(counter);
    $('#content').focus(counter);
});
		
// copy button
function copy() {
    let content = document.getElementById('content').select();
    document.execCommand('copy');
    let run = window.getSelection().removeAllRanges();
    $('#copied').fadeIn(400).delay(1000).fadeOut(400);
}

$(document).ready(() => {
    $('#calculator').hide(500);
    $('#scratchpad').hide(500);
    
    $('.right-side').click(() => {
        $('#calculator').show(500);
        $('#askme-form').hide(500);
        $('#scratchpad').hide(500);
    });
    
    $('.left-side').click(() => {
        $('#scratchpad').show(500);
        $('#askme-form').hide(500);
        $('#calculator').hide(500);
    });
    
    $('#tuna-image').click(() => {
        $('#askme-form').show(500);
        $('#scratchpad').hide(500);
        $('#calculator').hide(500);
    });
});

$(".left-side").hover( function (e) {
    $(this).toggleClass('animated pulse', e.type === 'mouseenter');
});

$(".right-side").hover( function (e) {
    $(this).toggleClass('animated pulse', e.type === 'mouseenter');
});

$("#tuna-image").hover( function (e) {
    $(this).toggleClass('animated pulse', e.type === 'mouseenter');
});

var ipc = require('electron').ipcRenderer;

var about = document.querySelector('#about');
about.addEventListener('click', function () {
    ipc.send('open-about-window');
});

var index = document.querySelector('#index');
index.addEventListener('click', function () {
    ipc.send('open-index-window');
});