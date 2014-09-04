Meadow::Application.routes.draw do
	root to: 'static_page#index'

  namespace :api, constraints: { format: 'json' } do
    post 'login/'             , to: 'sessions#create'            , as: 'login'
    post 'authenticate_token/', to: 'sessions#authenticate_token', as: 'authenticate_token'
    get  'logout/'            , to: 'sessions#destroy'           , as: 'logout'

    resources :projects, only: [:index, :show]

    namespace :admin do
      resources :projects, only: [:create, :update]
    end
  end

  # Redirect any other route to root and let angular handle it.
  get '*path' => redirect('/')
end
