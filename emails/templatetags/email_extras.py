from django import template

register = template.Library()


@register.simple_tag
def bold_violet_text(text):
    return f'<span style="font-family: sans-serif; font-weight: bolder; color: #20123a; text-decoration: none; font-size: 13px;">{text}</span>'


@register.simple_tag
def bold_violet_link(href, link_text):
    return f'<a href="{href}" target="_blank" style="font-family: sans-serif; color: #20123a; text-decoration: underline; font-weight: bolder; font-size: 13px;">{link_text}</a>'
