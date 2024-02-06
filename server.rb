require 'sinatra'
require 'sqlite3'

DB = {:conn => SQLite3::Database.new("db/database.db")}

set :views, File.expand_path('../views', __FILE__)
set :public_folder, 'public'
#set :database, 'sqlite3:db/database.db'
set :database_file, 'config/database.yml'

#bundle exec rerun puma
get '/' do
    erb :index
end

