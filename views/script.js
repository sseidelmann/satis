var composer = {};

jQuery(document).ready(function () {

    jQuery(document).on('click', 'h1', function () {
        location.hash = '#!home';
        jQuery('.details').hide();
        jQuery('.detail').hide();
        jQuery('.packages').show();
    });


    var orig = '';
    jQuery(document).on('focus', 'input#search', function () {
        orig = jQuery(this).val();
        jQuery(this).val('');
    });
    jQuery(document).on('blur', 'input#search', function () {
        if (jQuery(this).val() == '') {
            jQuery(this).val(orig);
        }
    });

    jQuery(document).on('click', 'pre div a', function () {
        jQuery(this).parent().parent().find('code').focus().select();
    });

    composer =  JSON.parse(cookie('composer')) || {};




    jQuery(document).on('click', '.version h4', function () {
        jQuery(this).parent().find('.version-detail').toggle();
    });

    jQuery(document).on('click', '.addtocomposer', function () {

        console.log('add to composer');
        var name    = jQuery(this).attr('data-name').replace('/', '#');
        var version = jQuery(this).attr('data-version');



        console.log('name:    ' + name);
        console.log('version: ' + version);

        if (!jQuery(this).hasClass('added')) {

            console.log(jQuery(this));
            console.log('  -> adding to cookie');

            if (typeof composer[name] == 'undefined') {
                composer[name] = version;
                console.log('  -> added new');
            } else {
                var current = composer[name];
                if (version != current) {
                    composer[name] = version;
                    console.log('  -> replaced old version ' + current);
                }
            }


            console.log('  -> adding class "added"');
            jQuery(this).addClass('added');
            jQuery(this).html('remove');
            console.log(this);
        } else if (jQuery(this).hasClass('added')) {
            delete composer[name];
            jQuery(this).removeClass('added').html('add');
        }

        cookie('composer', JSON.stringify(composer));
        composeradd();
    });

    composeradd();
});


composeradd = function () {
    jQuery('.addtocomposer').each(function () {
        var element = jQuery(this).parent();
        var name    = element.data('name');
        var version = element.data('version');

        if (typeof composer[name] != 'undefined' && version == composer[name]) {
            jQuery(this).addClass('added').html('remove');
        } else {
            jQuery(this).removeClass('added').html('add')
        }
    });

    createComposerJson();
}


createComposerJson = function () {

    var composer = JSON.parse(cookie('composer'));

    var json =  "{\n";
        json += "    \"repositories\": [\n";
        json += "        {\n";
        json += "            \"type\": \"composer\",\n";
        json += "            \"url\": \""+composerurl+"\"\n";
        json += "        }\n";
        json += "    ]";

        var len=0;for (var name in composer){len++};

        if (len > 0) {
            json += ",\n";
            json += "    \"require\": {\n";
            var cnt = 1;
            for (var name in composer) {
                json += "        \""+name.replace('#', '/')+"\": \""+composer[name]+"\""+(cnt<len?",":"")+"\n";
                cnt++;
            }
            json += "    }";
        }
        json += "\n";
        json += "}";

    jQuery('#composer-json').html(json);

    jQuery('#composer-json-short').html("echo '" + json.split("\n").join("").split(" ").join("") + "' > composer.json && curl -sS https://getcomposer.org/installer | php && php composer.phar install");
}

