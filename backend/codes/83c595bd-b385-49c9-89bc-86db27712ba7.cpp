
  #include <bits/stdc++.h> 
  using namespace std;
  
 string longestCommonPrefix(vector<string>& strs) {
        int n=strs.size();
        string ans="";
            for(int j=0;;j++)
            {
                for(int i=0;i<n-1;i++)
                {
                    if(j>=strs[i].size() || j>=strs[i+1].size() || strs[i][j]!=strs[i+1][j]){
                        return ans; 
                    }
                }
               if(j<strs[0].size())ans+=strs[0][j];
               else return ans;
            }
            return ans;
    }
    
  // Define the main function
  int main() { 

    int n;
    cin>>n;
    vector<string>strs;
    for(int i=0;i<n;i++)
    {
      string s;
      cin>>s;
      strs.push_back(s);
    }
    cout<<longestCommonPrefix(strs)

      return 0; 
  }