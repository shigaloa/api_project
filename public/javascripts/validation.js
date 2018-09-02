// Añadir en layout.jade, no comprobado

$('#recomendacion').submit(function (e) {
    $('.alert.alert-danger').hide();
    if (!$('input#nombre').val() || !$('select#puntuacion').val() ||
        !$('textarea#comentario').val()) {
        if ($('.alert.alert-danger').length) {
            $('.alert.alert-danger').show();
        } else {
            $(this).prepend('<div role="alert" class="alert alert-danger">Todos los campos requeridos, inténtalo de nuevo.</div > ');
        }
        return false;
    }
});