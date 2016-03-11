ReactionCore.registerPackage({
  label: "iAgents",
  name: "reaction-agents",
  icon: "fa fa-truck",
  autoEnable: true,
  settings: {
    name: "iAgents"
  },
  registry: [
    {
      provides: "dashboard",
      route: "dashboard/agents",
      label: "iAgents",
      description: "Rule-based expert system agents",
      icon: "fa fa-truck",
      cycle: 3,
      group: "reaction-agents"
    }, {
      label: "iAgents Settings",
      route: "dashboard/agents",
      provides: "settings",
      container: "dashboard",
      template: "agentsSettings"
    }, {
      route: "dashboard/agents",
      label: 'iAgents',
      provides: 'console'
    }
  ],
  permissions: [
    {
      label: "iAgents",
      permission: "dashboard/agents",
      group: "Shop Settings"
    }
  ]
});
