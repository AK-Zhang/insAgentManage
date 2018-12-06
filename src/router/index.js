import Vue from 'vue'
import Router from 'vue-router'
import Login from '../login'
import home from '@/components/home'
import subcommissiontemplates
from '@/components/settingTemplate/subcommissiontemplates'
import agentfeetemplates
from '@/components/settingTemplate/agentfeetemplates'
import subaccounts from '@/components/subaccounts/subaccounts'
import agents from '@/components/agents/agents'
import accountreports from '@/components/selects/accountreports'
import clientreports from '@/components/selects/clientreports'
import todayreports from '@/components/selects/todayreports'
import agentFeeTemplatesinfo from '@/components/settingTemplate/templateInfo/agentTemplateInfo'
import subcommissiontemplatesinfo from '@/components/settingTemplate/templateInfo/subCommissionTemplateInfo'
import selectedCominfo from '@/components/subaccounts/selectedCominfo/selectedCominfo'
import iphonregister from '../iphonregister'
import forgetPswd from '../forgetPswd'
import noticeAgents from '@/components/selects/noticeAgents'
import agentAccounts from '@/components/agents/agentAccounts'


let Rurl = localStorage.getItem("url")
if (Rurl == null) {
  Rurl = "/login/"
} else {
  Rurl = Rurl.split("#")[1]
}

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: Rurl
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/login/:id',
      name: 'login',
      component: Login
    },
    {
      path: '/login/',
      component: Login
    },
    {
      path: '/templates/subcommissiontemplates',
      name: 'subcommissiontemplates',
      component: subcommissiontemplates
    },
    {
      path: '/templatesinfo/subcommissiontemplatesinfo/:id',

      name: 'subcommissiontemplatesinfo',
      component: subcommissiontemplatesinfo
    },
    {
      path: '/templates/agentfeetemplates',
      name: 'agentfeetemplates',
      component: agentfeetemplates
    },
    {
      path: '/templatesinfo/agentFeeTemplatesinfo/:id',
      name: 'agentFeeTemplatesinfo',
      component: agentFeeTemplatesinfo
    },

    {
      path: '/subaccounts',
      name: 'subaccounts',
      component: subaccounts
    },
    {
      path: '/selectedCominfo/selectedCominfo/:id',

      name: 'selectedCominfo',
      component: selectedCominfo
    },
    {
      path: '/agents',
      name: 'agents',
      component: agents
    },
    {
      path: '/agentAccounts',
      name: 'agentAccounts',
      component: agentAccounts
    },
    {
      path: '/selects/accountreports',
      name: 'accountreports',
      component: accountreports
    },
    {
      path: '/selects/clientreports',
      name: 'clientreports',
      component: clientreports
    },
    {
      path: '/selects/todayreports',
      name: 'todayreports',
      component: todayreports
    },
    {
      path: '/selects/noticeAgents',
      name: 'noticeAgents',
      component: noticeAgents
    },
    {
      path: '/iphonregister',
      name: 'iphonregister',
      component: iphonregister
    },
    {
      path: '/forgetPswd',
      name: 'forgetPswd',
      component: forgetPswd
    }
  ]
})
