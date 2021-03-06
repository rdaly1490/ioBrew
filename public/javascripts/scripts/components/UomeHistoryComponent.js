var React = require('react');
var $ = require("jquery");
var moment = require('moment');

// var UomeCollection = require("../collections/UomeCollection");
var OweCollection = require("../collections/OweCollection");

module.exports = React.createClass({
	getInitialState: function() {

		var that=this;

		var OweHistory = new OweCollection();
		OweHistory.fetch({
			data: {
					filter:
					 {	
					 	// type: 2,
					 	finished: 1, //0 or 1 for binary T or F
					 	owedid: this.props.ioBrewUser.get("username")
					 } 
				  },
			success: function() {
				that.forceUpdate();
			}
		});
		OweHistory.on("sync", function() {
			that.forceUpdate();
		});

		return {
			oweHistory: OweHistory
		}
	},
	render: function() {
		var detailsStyle = {
			display:"none"
		};
		var that = this;

		var sortedModels = this.state.oweHistory.sortBy(function(oweModel) {
			return (-1*(new Date(oweModel.get("date_created")).getTime()));
		});

		if (sortedModels.length === 0) {
			var wlist = <div className="no-iobrews">
							<img src="/images/empty-list.png" />
							<h3>Theres Nothing Here</h3>
						</div>
		}
		else {
			var shortList = sortedModels.slice(0,20);
			var wlist = shortList.map(function(model) {
				return (
					<div>
						<div className={model.getClass(model)+" "+"each-iou"} key={model.cid}>
							<button onClick={that.showDetails}>Details</button>
							<img className="unchecked" src="/images/empty-mug2.png" />
							&nbsp;<b> {model.get("owername")} </b>
							Owes
							<b> You </b>
							a {model.get("category")}
							<div className="details" style={detailsStyle} key={model.get("_id")}>
								<p>Date Created: {moment(model.get("date_created")).calendar()}</p>
								<p>Created by: {model.get("createdby")}</p>
								<p>Reason: {model.get("reason")}</p>
								<p>Image associated with this item: <a href={model.get("image")}><img src={model.get("image")} /></a></p>
							</div>
						</div>
					</div>
				);
			});
		}

		return (
			<div className="container-fluid list-container">
				<a className="back-to-list" href="#uomelist">Back to List</a>
				<div className="col-xs-10 col-xs-offset-1 todo-list">
				<h2>Beers Owed to You Graveyard</h2>
					{wlist}
				</div>
			</div>
		);
	},
	showDetails: function(e) {
		e.preventDefault();
		var target = $(e.target);
		target.siblings(".details").toggle();
	}
});