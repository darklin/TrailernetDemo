import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/view/Home'
import Login from '@/view/Login'
import Error from '@/view/Error'

import Apply from '@/view/Apply'

import Visit from '@/view/Visit'
import NewCust from '@/view/visit/NewCust'
import DoCust from '@/view/visit/DoCust'
import BackCust from '@/view/visit/BackCust'
import AllCust from '@/view/visit/AllCust'
import WriteData from '@/view/visit/WriteData'
import EditData from '@/view/visit/EditData'
import BackEdit from '@/view/visit/BackEdit'
import CustDesc from '@/view/visit/CustDesc'

import Check from '@/view/Check'
import PendCheck from '@/view/check/PendCheck'
import NotPass from '@/view/check/NotPass'
import PendCheckDesc from '@/view/check/PendCheckDesc'
import NotPassDesc from '@/view/check/NotPassDesc'

import Bank from '@/view/Bank'
import PendBank from '@/view/bank/PendBank'
import PendLoan from '@/view/bank/PendLoan'
import LoanSuccess from '@/view/bank/LoanSuccess'
import NotPassBank from '@/view/bank/NotPassBank'
import PendBankDesc from '@/view/bank/PendBankDesc'
import PendLoanDesc from '@/view/bank/PendLoanDesc'
import LoanSuccessDesc from '@/view/bank/LoanSuccessDesc'
import NotBankDesc from '@/view/bank/NotBankDesc'

import Conf from '@/view/Conf'
import FinancialConf from '@/view/conf/FinancialConf'
import UniversityConf from '@/view/conf/UniversityConf'
import CompanyConf from '@/view/conf/CompanyConf'
import JobConf from '@/view/conf/JobConf'
import DataConf from '@/view/conf/DataConf'
import RuleConf from '@/view/conf/RuleConf'
import BaseConf from '@/view/conf/BaseConf'
import AllowConf from '@/view/conf/AllowConf'

Vue.use(Router)

export default new Router({
  base: '/',
  mode: 'history',
  routes: [
    { path: '/', name: 'Index', redirect: 'home' },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/', name: 'HomeIndex', redirect: 'apply' },
        { path: 'apply', name: 'Apply', component: Apply },
        {
          path: 'visit',
          component: Visit,
          children: [
            { path: '/', name: 'VisitIndex', redirect: 'newCust' },
            { path: 'newCust', name: 'NewCust', component: NewCust },
            { path: 'doCust', name: 'DoCust', component: DoCust },
            { path: 'backCust', name: 'BackCust', component: BackCust },
            { path: 'allCust', name: 'AllCust', component: AllCust },
            { path: 'writeData', name: 'WriteData', component: WriteData },
            { path: 'editData*', name: 'EditData', component: EditData },
            { path: 'backEdit*', name: 'BackEdit', component: BackEdit },
            { path: 'custDesc*', name: 'CustDesc', component: CustDesc }
          ]
        },
        {
          path: 'check',
          component: Check,
          children: [
            { path: '/', name: 'CheckIndex', redirect: 'pendCheck' },
            { path: 'pendCheck', name: 'PendCheck', component: PendCheck },
            { path: 'notPass', name: 'NotPass', component: NotPass },
            { path: 'pendCheckDesc*', name: 'PendCheckDesc', component: PendCheckDesc },
            { path: 'notPassDesc*', name: 'NotPassDesc', component: NotPassDesc }
          ]
        },
        {
          path: 'bank',
          component: Bank,
          children: [
            { path: '/', name: 'BankIndex', redirect: 'pendCheck' },
            { path: 'pendCheck', name: 'PendBank', component: PendBank },
            { path: 'pendLoan', name: 'PendLoan', component: PendLoan },
            { path: 'loanSuccess', name: 'LoanSuccess', component: LoanSuccess },
            { path: 'notPass', name: 'NotPassBank', component: NotPassBank },
            { path: 'pendBankDesc*', name: 'PendBankDesc', component: PendBankDesc },
            { path: 'pendLoanDesc*', name: 'PendLoanDesc', component: PendLoanDesc },
            { path: 'loanSuccessDesc*', name: 'LoanSuccessDesc', component: LoanSuccessDesc },
            { path: 'notBankDesc*', name: 'NotBankDesc', component: NotBankDesc }
          ]
        },
        {
          path: 'conf',
          component: Conf,
          children: [
            { path: '/', name: 'ConfIndex', redirect: 'financialConf' },
            { path: 'financialConf', name: 'FinancialConf', component: FinancialConf },
            { path: 'universityConf', name: 'UniversityConf', component: UniversityConf },
            { path: 'companyConf', name: 'CompanyConf', component: CompanyConf },
            { path: 'jobConf', name: 'JobConf', component: JobConf },
            { path: 'dataConf', name: 'DataConf', component: DataConf },
            { path: 'ruleConf', name: 'RuleConf', component: RuleConf },
            { path: 'baseConf', name: 'BaseConf', component: BaseConf },
            { path: 'allowConf', name: 'AllowConf', component: AllowConf }
          ]
        }
      ]
    },
    { path: '/login', name: 'Login', component: Login },
    { path: '*', name: 'Error', component: Error }
  ]
})
