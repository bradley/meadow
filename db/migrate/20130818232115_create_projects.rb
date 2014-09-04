class CreateProjects < ActiveRecord::Migration
  def self.up
  	create_table :projects do |t|
      t.belongs_to :user

      t.string :title
      t.text :content
      t.string :url

      t.timestamps
    end
    add_index :projects, :user_id
  end

  def self.down
  	drop_table :projects
  end
end

