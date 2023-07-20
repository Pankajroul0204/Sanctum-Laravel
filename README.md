# Sanctum-Laravel

_1. Remove the commented  api from app/kernel.php_

**\Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class**

_2.Add Abilities in  protected MiddlewareAliases of kernel.php ._

 **'abilities' => \Laravel\Sanctum\Http\Middleware\CheckAbilities::class,
'ability' => \Laravel\Sanctum\Http\Middleware\CheckForAnyAbility::class,**

_3.Make A CustomModel._
Add these things in the CustomModel

a)**use Illuminate\Foundation\Auth\User as Authenticatable;**
b)**use Laravel\Sanctum\HasApiTokens;** and
c)use inside the class of that model
 **use HasFactory, HasApiTokens;**

 _4.Make Related guard to your model in config/auth.php _
 ** 'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
        'admin' => [
            'driver' => 'session',
            'provider' => 'admins',
        ],
        'emp' => [
            'driver' => 'session',
            'provider' => 'emps',
        ],
    ],**

    _5. Also make providers which is to be used by the guard _

   ** 'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
        'admins' => [
            'driver' => 'eloquent',
            'model' => App\Models\Admin::class,
        ],
        'emps' => [
            'driver' => 'eloquent',
            'model' => App\Models\Employee::class,
        ]**

    _6.Make a controller and add the necessary namespaces_
    a)use Validator;
    b) use Auth;
    c)sue App\Models\CustomModel

    write code for login based on role abilities.
**Login Function**
     public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        } else {
            $admin = Admin::where('email', $request->email)->where('password', $request->password)->first();
            $emp = Employee::where('email', $request->email)->where('password', $request->password)->first();
            if ($admin != null) {
                $token = $admin->createToken('Myapp', ['admin'])->plainTextToken;
                return response()->json([$admin, 'token' => $token], 200);
            } elseif ($emp != null) {
                $token = $emp->createToken('Myapp', ['emp'])->plainTextToken;
                return response()->json([$emp, 'token' => $token], 200);
            } else {
                return response()->json(['error' => 'Bad Request!'], 400);
            }
        }
    }

   **User Details Function**
       public function EmpDtls()
    {
        $data = Auth::user();
        return response()->json($data);
    }

    _7.In api.php add the necessary namespaces_
    a)use your Controller
    Add the middleware in the route with user aabilities
    Route::middleware(['auth:sanctum', 'abilities:admin'])->get('admin/dtls', [AuthController::class, 'AdminDtls']);
    Route::middleware(['auth:sanctum', 'abilities:emp'])->get('emp/dtls', [AuthController::class, 'EmpDtls']);
    Route::middleware('auth:sanctum')->get('/logout', [AuthController::class, 'logout']); 

