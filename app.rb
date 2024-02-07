require 'sinatra'
require 'sinatra/json'
require 'sequel'
require 'json'

set :views, File.expand_path('../views', __FILE__)
set :public_folder, 'public'

before do
    response.headers['Access-Control-Allow-Origin'] = '*' 
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
end
  
options "*" do
    response.headers["Allow"] = "GET, POST"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
    200
end

DB = Sequel.connect('sqlite://api.db')

DB.create_table? :sites do
    primary_key :id
    String :url
    String :name
    DateTime :created_at
    DateTime :updated_at
    Integer :time_spent
end

class Site < Sequel::Model
end

def time_since_created(created_at)
    time = Time.now - created_at
    time.to_i
end

get '/' do
    erb :index
end


get '/sites' do
    sites = Site.all
    #json sites
    sites.map(&:values).to_json
end

get '/sites/:id' do
    site = Site[params[:id]]
    json site
end

# post '/sites' do

#     #check if the site already exists
#     site = Site.where(url: params[:url]).first
#     if site
#         site.update(
#             time_spent: time_since_created(site.created_at)
#         )
#         json site
#     else
#         site = Site.create(
#             url: params[:url],
#             name: params[:name],
#             created_at: Time.now,
#             updated_at: Time.now,
#             time_spent: 0
#         )
#         json site
#     end
# end

post '/sites' do
    request.body.rewind
    request_payload = JSON.parse(request.body.read)
  
    # Now access the parameters via request_payload instead of params
    site = Site.where(url: request_payload['url']).first
    if site
      site.update(
        time_spent: time_since_created(site.created_at)
      )
      json site
    else
      site = Site.create(
        url: request_payload['url'],
        name: request_payload['name'],
        created_at: Time.now,
        updated_at: Time.now,
        time_spent: 0
      )
      json site
    end
end


put '/sites/:id' do
    site = Site[params[:id]]
    site.update(
        url: params[:url],
        name: params[:name],
        updated_at: Time.now
    )
    json site
end

delete '/sites/:id' do
    site = Site[params[:id]]
    site.destroy
    json site
end

put '/sites/:id/time_spent' do
    site = Site[params[:id]]
    site.update(
        time_spent: site.time_spent + 1
    )
    json site
end
