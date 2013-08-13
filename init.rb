require "wpe_hook_listener"

Redmine::Plugin.register :redmine_password_encrypter do
  name 'Redmine Password Encrypter plugin'
  author 'Boris Brodski'
  description 'Encrypt password on the wiki/issue pages using Javascript. Type PWD(pass1) to start.'
  version '0.0.1'
  url 'https://github.com/borisbrodski/redmine_password_encrypter'
  author_url 'https://github.com/borisbrodski'
end
