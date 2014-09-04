class Api::Admin::ProjectsController < Api::ApiController
	before_action :validate_token
  before_action :find_project, only: [:update]

  def create
    @project = current_user.projects.new(project_params)

    if @project.save
      render status: 200, json: { success: "Project was successfully created.", project: @project }
    else
      render status: 422, json: { error: "There are problems with the project you attempted to save.", errors: @project.errors }
    end
  end

  def update
    if @project.update_attributes(project_params)
      render status: 200, json: { success: "Project was successfully updated.", project: @project }
    else
      render status: 422, json: { error: "There are problems with the project you attempted to save.", errors: @project.errors }
    end
  end

  private

    def find_project
      @project = current_user.projects.find_by_url(params[:id]) || not_found
    end

    def project_params
      # Note this this is not every param available to Project objects.
      #   We only allow raw_content and title to be passed in because a project's
      #   additional attributes (content, footnotes) are set by the model itself.
      params.require(:project).permit(
        :raw_content, :title
      )
    end
end
