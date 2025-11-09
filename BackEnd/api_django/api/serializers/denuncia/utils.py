from rest_framework import serializers

MAX_FILES_PER_REQUEST = 3


def enforce_file_upload_limit(serializer):
    """
    Valida se a quantidade total de arquivos enviados na requisição
    ultrapassa `MAX_FILES_PER_REQUEST`.
    """
    request = serializer.context.get("request")
    files = getattr(request, "FILES", None) if request else None
    if not files:
        return

    total_files = sum(len(file_list) for _, file_list in files.lists())
    if total_files > MAX_FILES_PER_REQUEST:
        raise serializers.ValidationError(
            f"Envie no máximo {MAX_FILES_PER_REQUEST} arquivos por requisição (recebidos {total_files})."
        )
