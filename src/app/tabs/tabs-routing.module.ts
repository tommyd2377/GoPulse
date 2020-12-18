import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'article/:id',
            loadChildren: () =>
              import('../article/article.module').then(m => m.ArticlePageModule)
          },
          {
            path: 'user/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../user/user.module').then(m => m.UserPageModule)
              },
              {
                path: 'followers',
                loadChildren: () => import('../user-followers/user-followers.module').then( m => m.UserFollowersPageModule)
              },
              {
                path: 'following',
                loadChildren: () => import('../user-following/user-following.module').then( m => m.UserFollowingPageModule)
              },
            ]
          }
        ]
      },
      {
        path: 'pulse',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pulse/pulse.module').then(m => m.PulsePageModule)
          },
          {
            path: 'article/:id',
            loadChildren: () =>
              import('../article/article.module').then(m => m.ArticlePageModule)
          },
          {
            path: 'user/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../user/user.module').then(m => m.UserPageModule)
              },
              {
                path: 'followers',
                loadChildren: () => import('../user-followers/user-followers.module').then( m => m.UserFollowersPageModule)
              },
              {
                path: 'following',
                loadChildren: () => import('../user-following/user-following.module').then( m => m.UserFollowingPageModule)
              },
            ]
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'article/:id',
            loadChildren: () =>
              import('../article/article.module').then(m => m.ArticlePageModule)
          },
          {
            path: 'user/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../user/user.module').then(m => m.UserPageModule)
              },
              {
                path: 'followers',
                loadChildren: () => import('../user-followers/user-followers.module').then( m => m.UserFollowersPageModule)
              },
              {
                path: 'following',
                loadChildren: () => import('../user-following/user-following.module').then( m => m.UserFollowingPageModule)
              },
            ]
          }
        ]
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'article/:id',
            loadChildren: () =>
              import('../article/article.module').then(m => m.ArticlePageModule)
          },
          {
            path: 'user/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                import('../user/user.module').then(m => m.UserPageModule)
              },
              {
                path: 'followers',
                loadChildren: () => import('../user-followers/user-followers.module').then( m => m.UserFollowersPageModule)
              },
              {
                path: 'following',
                loadChildren: () => import('../user-following/user-following.module').then( m => m.UserFollowingPageModule)
              },
            ]
          },
          {
            path: 'followers',
            loadChildren: () => import('../followers/followers.module').then( m => m.FollowersPageModule)
          },
          {
            path: 'following',
            loadChildren: () => import('../following/following.module').then( m => m.FollowingPageModule)
          },
          {
            path: 'profile-settings',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule)
              },
              {
                path: 'account',
                loadChildren: () => import('../account/account.module').then( m => m.AccountPageModule)
              },
              {
                path: 'update-profile',
                loadChildren: () => import('../update-profile/update-profile.module').then( m => m.UpdateProfilePageModule)
              }
            ]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
