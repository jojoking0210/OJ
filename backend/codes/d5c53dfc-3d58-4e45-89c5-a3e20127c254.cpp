 #include <bits/stdc++.h> 
  using namespace std;

struct Node{
    int value=-1;
};

    int lengthOfLongestSubstring(string str) {
        int n=str.length();
        if(n==0)return 0;
        int l=0;
        int r=0;
        int ans=INT_MIN;
        map<char,Node> mp;
        while(r<n)
        {
            if(mp[str[r]].value!=-1)
            {
                l=max(mp[str[r]].value+1,l);
            }
            mp[str[r]].value=r;
            ans=max(ans,r-l+1);
             r++;
        }
        return ans;
    }
    
  // Define the main function
  int main() { 

   string s;
   cin>>s;
   cout<<lengthOfLongestSubstring(s);

      return 0; 
  }
  


