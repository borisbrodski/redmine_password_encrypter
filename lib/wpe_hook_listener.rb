class WPEHookListener < Redmine::Hook::ViewListener
  def view_layouts_base_html_head(context={} )
    js = javascript_include_tag 'redmine-password-encrypter', :plugin => 'redmine_password_encrypter'
    js += javascript_include_tag 'aes.js', :plugin => 'redmine_password_encrypter'
    css = stylesheet_link_tag 'redmine-password-encrypter', :plugin => 'redmine_password_encrypter'
    js + css
  end
end
