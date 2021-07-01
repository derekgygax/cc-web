package com.coupleconn.data;

import java.util.ArrayList;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonView;
import com.coupleconn.data.SearchParamViews;

public class SearchParam {
	public String column;
	public String table;
	public boolean bothPartners;
	public String id;
	public String title;
	public String group;
	public String type;
	public int min;
	public int max;
	public ArrayList<String> values;
	
	@JsonView(SearchParamViews.Base.class)
	public String getGroup() {
		return group;
	}
	
	public void setGroup(String group) {
		this.group = group;
	}
	@JsonIgnore
	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	
	@JsonIgnore
	public boolean isBothPartners() {
		return bothPartners;
	}
	public void setBothPartners(boolean bothPartners) {
		this.bothPartners = bothPartners;
	}
	
	@JsonIgnore
	public String getColumn() {
		return column;
	}
	public void setColumn(String column) {
		this.column = column;
	}
	
	@JsonView(SearchParamViews.Base.class)
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	@JsonView(SearchParamViews.Base.class)
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	@JsonView(SearchParamViews.Base.class)
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@JsonView(SearchParamViews.Range.class)
	public int getMin() {
		return min;
	}
	public void setMin(int min) {
		this.min = min;
	}
	
	@JsonView(SearchParamViews.Range.class)
	public int getMax() {
		return max;
	}
	public void setMax(int max) {
		this.max = max;
	}
	
	@JsonView(SearchParamViews.Enumeration.class)
	public ArrayList<String> getValues() {
		return values;
	}
	public void addValue(String value) {
		if (this.values == null) {
			this.values = new ArrayList<String>();
		}
		this.values.add(value);
	}
	
}
