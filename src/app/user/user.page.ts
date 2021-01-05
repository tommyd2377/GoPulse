import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { GlobalParamsService } from '../global-params.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})

export class UserPage implements OnInit {

  thisIsYou: boolean;
  userIsFollowing: boolean;
  uid: string;
  displayName: string;
  userId: string;
  userDisplayName: string;
  followers;
  following;
  cuFollowing;
  date: Date;
  currentTime: number;
  userProfileDoc;
  userdoc;
  userActivity;
  photoUrl;
  userPhotoUrl;
  parentTab;
  unFollowID: string;
  unFollow1: any;
  unFollow2: any;
  unFollow3: any;
  followerunFollow: any;
  unFollowID4: any;
  unFollowID2: string;
  unFollowID1: string;
  unFollowID3: string;
  unFollow6: any;
  unFollowID6: string;
  unFollow7: any;
  unFollowID7: any;

  constructor(private fireAuth: AngularFireAuth,
              private router: Router,
              public route: ActivatedRoute,
              private afs: AngularFirestore,
              public globalProps: GlobalParamsService,
              public toastController: ToastController) { }

  ngOnInit() {
    this.fireAuth.auth.onAuthStateChanged((user) => {
      if (user) {
 
        this.uid = user.uid;
        this.displayName = user.displayName;
        this.photoUrl = user.photoURL;
        this.userId = this.route.snapshot.paramMap.get('id');

        if (this.uid === this.userId) {
          this.thisIsYou = true;
        }
        else {
          this.thisIsYou = false;
        }

        this.cuFollowing = this.afs.collection("users").doc(this.uid).collection("following").valueChanges({idField: 'followID'})
          .subscribe(results => {
            for (let result of results) { 
              if (result.followeeUid === this.userId) {
                  this.userIsFollowing = true;
                  this.unFollowID = result.followID;
              }
              else {
                this.userIsFollowing = false;
              }
            }
          })

        this.userProfileDoc = this.afs.collection("users").doc(this.userId).valueChanges();

        this.userdoc = this.afs.collection("users").doc(this.userId).ref.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            console.log(doc.data().displayName);
            this.userDisplayName = doc.data().displayName;
            this.userPhotoUrl = doc.data().photoURL;

          } else {
            console.log("No such document!");
          }
        }).catch(function(error) {
          console.log("Error getting document:", error);
        });

        this.userActivity = this.afs.collection("users").doc(this.userId).collection("publicActivity", ref => ref.orderBy('createdAt', 'desc')).valueChanges()
          .subscribe(activity => this.userActivity = activity);
        
        this.followers = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges();
        
        this.following = this.afs.collection("users").doc(this.userId).collection("following").valueChanges();
      }
    })
  }
 
  openArticle($event, active) {
    this.globalProps.title = active.title;
    this.globalProps.articleUrl = active.articleUrl;
    this.globalProps.publishDate = active.publishDate;
    this.globalProps.publisher = active.publisher;
    this.globalProps.image = active.image;
    this.globalProps.description = active.description;
    this.globalProps.content = active.content;
    this.globalProps.titleID = active.titleID;
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/article/' + this.globalProps.titleID);
  }

  openUser($event, active) {
    console.log($event, active);
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + active.uid);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000
    });
    toast.present();
  }

  follow() {   
    if (!this.userIsFollowing) {
      this.date = new Date();
      this.currentTime = this.date.getTime();

      const followRef1 = this.afs.collection("users").doc(this.userId).collection("followers");
        followRef1.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
                         followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
                         .then(()=> console.log("Following"))
                         .catch((err)=> console.log("Following Error: " + err));

      const followRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity");
      followRef2.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
                       .then(()=> console.log("Following"))
                       .catch((err)=> console.log("Following Error: " + err));
      
      const followRef7 = this.afs.collection("users").doc(this.userId).collection("privateActivity");
      followRef7.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followedIsTrue: (true) })
                      .then(()=> console.log("Following"))
                      .catch((err)=> console.log("Following Error: " + err));
                      
      const followRef3 = this.afs.collection("users").doc(this.uid).collection("following");
      followRef3.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                       .then(()=> console.log("Following"))
                       .catch((err)=> console.log("Following Error: " + err));

      const followRef4 = this.afs.collection("users").doc(this.uid).collection("publicActivity");
      followRef4.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                       .then(()=> console.log("Following"))
                       .catch((err)=> console.log("Following Error: " + err));

      const followRef6 = this.afs.collection("users").doc(this.uid).collection("privateActivity");
      followRef6.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
        followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                      .then(()=> console.log("Following"))
                      .catch((err)=> console.log("Following Error: " + err));

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
      this.followers.subscribe(results => {
        for (let result of results) { 
          const followRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity");
          followRef5.add({ followerUid: (this.uid), followerDisplayName: (this.displayName), followerPhotoUrl: (this.photoUrl), 
            followeeUid: (this.userId), followeeDisplayName: (this.userDisplayName), followeePhotoUrl: (this.userPhotoUrl), followingIsTrue: (true) })
                           .then(()=> console.log("Following"))
                           .catch((err)=> console.log("Following Error: " + err));
        }
      })
      this.userIsFollowing = true;
      this.presentToast("Following");
    }
  }

  unFollow() {
    if (this.userIsFollowing) {

      const unFollowRef = this.afs.collection("users").doc(this.uid).collection("following").doc(this.unFollowID);
        unFollowRef.delete().then(() => console.log("unFollowed"));

      this.unFollow1 = this.afs.collection("users").doc(this.uid).collection("publicActivity").valueChanges({idField: 'unFollowID1'})
        .subscribe(results => {
          for (let result of results) { 
            if (result.followeeUid === this.userId) {
              
              this.unFollowID1 = result.unFollowID1;
              const unFollowRef1 = this.afs.collection("users").doc(this.uid).collection("publicActivity").doc(this.unFollowID1);
              unFollowRef1.delete().then(() => console.log("unFollowed"));
            }
          }
      });

      this.unFollow6 = this.afs.collection("users").doc(this.uid).collection("privateActivity").valueChanges({idField: 'unFollowID6'})
        .subscribe(results => {
          for (let result of results) { 
            if (result.followeeUid === this.userId) {
              this.unFollowID6 = result.unFollowID1;
              const unFollowRef6 = this.afs.collection("users").doc(this.uid).collection("privateActivity").doc(this.unFollowID6);
              unFollowRef6.delete().then(() => console.log("unFollowed"));
            }
          }
      });
      
      this.unFollow2 = this.afs.collection("users").doc(this.userId).collection("publicActivity").valueChanges({idField: 'unFollowID2'})
      .subscribe(results => {
        for (let result of results) { 
          if (result.followerUid === this.uid) {
            this.unFollowID2 = result.unFollowID2;
            const unFollowRef2 = this.afs.collection("users").doc(this.userId).collection("publicActivity").doc(this.unFollowID2);
            unFollowRef2.delete().then(() => console.log("unliked"));
          
          }
        }
      });

      this.unFollow3 = this.afs.collection("users").doc(this.userId).collection("privateActivity").valueChanges({idField: 'unFollowID3'})
      .subscribe(results => {
        for (let result of results) { 
          if (result.followerUid === this.uid) {
            this.unFollowID3 = result.unFollowID3;
            const unFollowRef4 = this.afs.collection("users").doc(this.userId).collection("privateActivity").doc(this.unFollowID3);
            unFollowRef4.delete().then(() => console.log("unliked"));
          }
        }
      });

      this.unFollow7 = this.afs.collection("users").doc(this.userId).collection("followers").valueChanges({idField: 'unFollowID7'})
      .subscribe(results => {
        for (let result of results) { 
          if (result.followerUid === this.uid) {
            this.unFollowID7 = result.unFollowID7;
            const unFollowRef4 = this.afs.collection("users").doc(this.userId).collection("followers").doc(this.unFollowID7);
            unFollowRef4.delete().then(() => console.log("unliked"));
          }
        }
      });

      this.followers = this.afs.collection("users").doc(this.uid).collection("followers").valueChanges();
        this.followers.subscribe(results => {
          for (let result of results) { 
            this.followerunFollow = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").valueChanges({idField: 'unFollowID4'});
            this.followerunFollow.subscribe(results1 => {
              for (let result1 of results1) {
                if (result.followeeUid === this.userId) {
                  this.unFollowID4 = result1.likeID4;
                  const unFollowRef5 = this.afs.collection("users").doc(result.followerUid).collection("followingActivity").doc(this.unFollowID4);
                  unFollowRef5.delete().then(() => console.log("unFollowed"));
                }
              }
          })
        }
      });

      this.userIsFollowing = false;
      this.presentToast("Not Following");
    }
  }

  goToFollowers() {
    this.globalProps.userId = this.userId;
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + this.userId + '/followers');
  }

  goToFollowing() {
    this.globalProps.userId = this.userId;
    this.router.navigateByUrl('tabs/' + this.globalProps.currentTab + '/user/' + this.userId + '/following');
  }

}