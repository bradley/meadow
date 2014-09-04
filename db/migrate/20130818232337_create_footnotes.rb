class CreateFootnotes < ActiveRecord::Migration
  def self.up
  	create_table :footnotes do |t|
      t.text :content
      t.belongs_to :project
    end
    add_index :footnotes, :project_id
  end

  def self.down
  	drop_table :footnotes
  end
end
