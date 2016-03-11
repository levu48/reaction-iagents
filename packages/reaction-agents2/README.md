#levu48:reaction-agents package.

`meteor add levu48:reaction-agents`

##Description

Adding rule-based agents capability to ReactionCommerce platform,

## Installation

- copy reaction-agents into /packages directory
- meteor add meteorhacks:npm
- meteor add http
- npm install nools
- meteor add levu48:reaction-agents
- meteor add autopublish
- meteor remove audit-argument-checks
- add two lines to /clients/template/layout.js
	Template.agentsLayoutHeader.replaces("layoutHeader");
	Template.agentsCoreHead.replaces("coreHead");
