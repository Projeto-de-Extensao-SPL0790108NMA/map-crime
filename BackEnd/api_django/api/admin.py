from typing import ClassVar

from django.contrib import admin
from django.utils.html import format_html

from .models import Denuncia


@admin.register(Denuncia)
class DenunciaAdmin(admin.ModelAdmin):
    """Admin customizado para Denuncia com filtros, busca e exibição melhorada."""
    
    # Campos exibidos na listagem
    list_display = (
        'id_truncado',
        'protocolo',
        'usuario',
        'categoria',
        'status_colored',
        'localizacao_display',
        'has_midia',
        'has_audio',
        'created_at_formatted',
        'updated_at_formatted',
    )
    
    # Filtros laterais
    list_filter = (
        'status',
        'categoria',
        'usuario',
        'created_at',
        'updated_at',
    )
    
    # Campos de busca
    search_fields = (
        'id',
        'protocolo',
        'categoria',
        'descricao',
        'usuario__email',
        'usuario__name',
    )
    
    # Ordenação padrão
    ordering = ('-created_at',)
    
    # Campos somente leitura
    readonly_fields = (
        'id',
        'protocolo',
        'created_at',
        'updated_at',
        'localizacao_display',
        'midia_preview',
        'audio_preview',
    )
    
    # Organização dos campos no formulário de edição
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('id', 'protocolo', 'usuario', 'categoria', 'status')
        }),
        ('Descrição', {
            'fields': ('descricao',),
            'classes': ('wide',)
        }),
        ('Localização', {
            'fields': ('localizacao', 'localizacao_display'),
        }),
        ('Mídia', {
            'fields': ('midia', 'midia_preview'),
            'classes': ('collapse',)
        }),
        ('Áudio', {
            'fields': ('audio', 'audio_preview'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Paginação
    list_per_page = 25
    
    # Ações customizadas
    actions: ClassVar[list[str]] = ['marcar_como_analise', 'marcar_como_resolvido', 'marcar_como_rejeitado']
    
    # Métodos para exibição formatada
    def id_truncado(self, obj):
        """Exibe o UUID truncado"""
        return str(obj.id)[:8] + '...'
    id_truncado.short_description = 'ID'
    
    def status_colored(self, obj):
        """Exibe o status com cor"""
        colors = {
            'em_analise': '#FFA500',      # Laranja
            'resolvido': '#28a745',       # Verde
            'rejeitado': '#dc3545',       # Vermelho
        }
        color = colors.get(obj.status, '#6c757d')  # Cinza como padrão
        return format_html(
            '<span style="color: white; background-color: {}; padding: 5px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_status_display() if hasattr(obj, 'get_status_display') else obj.status
        )
    status_colored.short_description = 'Status'
    
    def localizacao_display(self, obj):
        """Exibe a localização formatada"""
        if obj.localizacao:
            return f"Lat: {obj.localizacao.y:.6f}, Lon: {obj.localizacao.x:.6f}"
        return "—"
    localizacao_display.short_description = 'Localização'
    
    def has_midia(self, obj):
        """Indica se há mídia anexada"""
        if obj.midia:
            return format_html('<span style="color: green; font-weight: bold;">✓ Sim</span>')
        return format_html('<span style="color: red;">✗ Não</span>')
    has_midia.short_description = 'Mídia'
    
    def has_audio(self, obj):
        """Indica se há áudio anexado"""
        if obj.audio:
            return format_html('<span style="color: green; font-weight: bold;">✓ Sim</span>')
        return format_html('<span style="color: red;">✗ Não</span>')
    has_audio.short_description = 'Áudio'
    
    def created_at_formatted(self, obj):
        if not getattr(obj, "created_at", None):
            return "—"
        return obj.created_at.strftime('%d/%m/%Y %H:%M')
    created_at_formatted.short_description = 'Criada em'

    def updated_at_formatted(self, obj):
        if not getattr(obj, "updated_at", None):
            return "—"
        return obj.updated_at.strftime('%d/%m/%Y %H:%M')
    updated_at_formatted.short_description = 'Atualizada em'
    
    def midia_preview(self, obj):
        """Preview da mídia"""
        if obj.midia:
            return format_html(
                '<a href="{}" target="_blank">📎 Baixar arquivo</a>',
                obj.midia.url
            )
        return "—"
    midia_preview.short_description = 'Prévia da Mídia'
    
    def audio_preview(self, obj):
        """Preview do áudio"""
        if obj.audio:
            return format_html(
                '<audio controls><source src="{}" type="audio/mpeg"></audio>',
                obj.audio.url
            )
        return "—"
    audio_preview.short_description = 'Prévia do Áudio'
    
    # Ações customizadas
    def marcar_como_analise(self, request, queryset):
        """Marca denúncias como em análise"""
        updated = queryset.update(status='em_analise')
        self.message_user(request, f'{updated} denúncia(s) marcada(s) como em análise.')
    marcar_como_analise.short_description = 'Marcar como em análise'
    
    def marcar_como_resolvido(self, request, queryset):
        """Marca denúncias como resolvidas"""
        updated = queryset.update(status='resolvido')
        self.message_user(request, f'{updated} denúncia(s) marcada(s) como resolvida(s).')
    marcar_como_resolvido.short_description = 'Marcar como resolvido'
    
    def marcar_como_rejeitado(self, request, queryset):
        """Marca denúncias como rejeitadas"""
        updated = queryset.update(status='rejeitado')
        self.message_user(request, f'{updated} denúncia(s) marcada(s) como rejeitada(s).')
    marcar_como_rejeitado.short_description = 'Marcar como rejeitado'
