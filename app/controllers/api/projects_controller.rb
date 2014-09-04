class Api::ProjectsController < Api::ApiController
  before_action :find_project, only: [:show]

  def index
    @projects = Project.all
    render json: @projects
  end

  def show
    render json: @project
  end

  private

    def find_project
      @project = Project.find_by_url(params[:id]) || not_found
    end

    def project_params
      params.require(:project).permit(
        :raw_content, :title, :content, :url, :tag_list, :tags, :footnotes, :footnote_list
      )
    end
end
