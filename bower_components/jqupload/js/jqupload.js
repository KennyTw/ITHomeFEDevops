$(function () {
        'use strict';
	var url = '/upload/location',
                uploadButton = $('<button/>')
                        .addClass('btn btn-primary')
                        .prop('disabled', true)
                        .text('Processing...')
                        .on('click', function () {
                                var $this = $(this),
                                        data = $this.data();
                                $this
                                        .off('click')
                                        .text('Abort')
                                        .on('click', function () {
                                                $this.remove();
                                                data.abort();
                                        });
                                data.submit().always(function () {
                                        $this.remove();
                                });
                        });
        $('#fileupload').fileupload({
                url: url,
                dataType: 'json',
                autoUpload: true,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|mp4)$/i,
                maxFileSize: 5000000000,
                disableImageResize: /Android(?!.*Chrome)|Opera/
                        .test(window.navigator.userAgent),
                previewMaxWidth: 80,
                previewMaxHeight: 80,
                previewCrop: true,
                limitConcurrentUploads: 1,
                singleFileUploads: false,
				imageOrientation: true, 
				disableImageMetaDataSave: false,
                maxNumberOfFiles: 1
                //getNumberOfFiles: function () { return 1 }
        }).on('fileuploadadd', function (e, data) {
				var progress = 0;
				$('#progress .bar').css(
						'width',
						progress + '%'
				);		
				$('#files.files').empty();
                data.context = $('<div/>').appendTo('#files');
                $.each(data.files, function (index, file) {
                        var node = $('<p/>')
                                .append($('<span/>').text(file.name))
								.append('<b> is being processed</b>');
                                //.append('<br>');
                        if (!index) {
                                node
                                        .append('');
                                        // Disable uploadButton -- TK
                                        //.append(uploadButton.clone(true).data(data));
                        }
                        node.appendTo(data.context);
                });
                // disable add file button -- TK
                //$('fileinput-button').hide();
                //$('#fileupload').hide();
        }).on('fileuploadprocessalways', function (e, data) {
                var index = data.index,
                        file = data.files[index],
                        node = $(data.context.children()[index]);
                if (file.preview) {
                        node
                                .prepend('<br>')
                                .prepend(file.preview);
                }
                if (file.error) {
                        node
                                .append('<br>')
                                .append($('<span class="text-danger"/>').text(file.error));
                }
                if (index + 1 === data.files.length) {
                        data.context.find('button')
                                .text('Upload')
                                .prop('disabled', !!data.files.error);
                }
        }).on('fileuploadprogressall', function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                //$('#progress .progress-bar').css(
                //      'width',
                //      progress + '%'
                //);
                $('#progress .bar').css(
                        'width',
                        progress + '%'
                );
        }).on('fileuploaddone', function (e, data) {
                $.each(data.result.files, function (index, file) {
                        //document.getEoementById("cantidadCopias").disabled = true;
			var url = file.url;
			var filename = url.match(/.*\/(.*)$/)[1];
                        if (file.url) {
								var uploadedfile = $('<input id="filename" type="hidden" name="filename" value="' + filename + '">');
                                $(data.context.children()[index])
                                        .append('<br>')
										.append('<b>File upload completed!</b>')
                                        .append(uploadedfile);
                                //var link = $('<a>')
                                //      .attr('target', '_blank')
                                //      .prop('href', file.url);
                                //$(data.context.children()[index])
                                //      .wrap(link);
                        } else if (file.error) {
                                var error = $('<span class="text-danger"/>').text(file.error);
                                $(data.context.children()[index])
                                        .append('<br>')
                                        .append(error);
                        }
                console.log(file.url);
                });
        }).on('fileuploadfail', function (e, data) {
                $.each(data.files, function (index, file) {
                        var error = $('<span class="text-danger"/>').text('File upload failed.');
                        $(data.context.children()[index])
                                .append('<br>')
                                .append(error);
                });
        }).prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
});
